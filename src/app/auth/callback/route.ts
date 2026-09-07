import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BRAND_VERIFICATION_PATH,
  createMinimalBrandProfile,
  getBrandRoutingDecision,
  serializeSupabaseError,
} from "@/lib/auth/brandRouting";

function redirectTo(origin: string, pathname: string) {
  return NextResponse.redirect(new URL(pathname, origin));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const callbackLog = {
    origin,
    codePresent: Boolean(code),
    exchangeSuccess: false,
    userExists: false,
    profileExists: false,
    accessStatus: "unknown",
    finalRedirectPath: "",
  };

  const finish = (pathname: string) => {
    callbackLog.finalRedirectPath = pathname;
    console.info("[Auth Callback] routing", callbackLog);
    return redirectTo(origin, pathname);
  };

  if (!code) {
    return finish(`/login?error=${encodeURIComponent("missing_oauth_code")}`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    callbackLog.exchangeSuccess = !exchangeError;

    if (exchangeError) {
      console.error("[Auth Callback] exchange failed:", serializeSupabaseError(exchangeError));
      return finish(`/login?error=${encodeURIComponent("oauth_exchange_failed")}`);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    callbackLog.userExists = Boolean(user);

    if (userError || !user) {
      if (userError) {
        console.error("[Auth Callback] user lookup failed:", serializeSupabaseError(userError));
      }
      return finish(`/login?error=${encodeURIComponent("session_missing")}`);
    }

    const decision = await getBrandRoutingDecision(supabase, user.id);

    if (!decision.ok) {
      console.error("[Auth Callback] profile routing failed:", {
        code: decision.code,
        message: decision.message,
        error: decision.error,
      });
      return finish(`/login?error=${encodeURIComponent("oauth_profile_check_failed")}`);
    }
    callbackLog.profileExists = Boolean(decision.profile);
    callbackLog.accessStatus = decision.accessStatus;

    if (decision.reason === "missing_profile") {
      const { error: createProfileError } = await createMinimalBrandProfile(supabase, user);

      if (createProfileError) {
        console.error("[Auth Callback] minimal profile create failed:", serializeSupabaseError(createProfileError));
        return finish(`/login?error=${encodeURIComponent("oauth_profile_create_failed")}`);
      }

      callbackLog.profileExists = true;
      callbackLog.accessStatus = "incomplete";
      return finish(BRAND_VERIFICATION_PATH);
    }

    return finish(decision.redirectTo);
  } catch (error) {
    console.error("[Auth Callback] unexpected failure:", serializeSupabaseError(error));
    return finish(`/login?error=${encodeURIComponent("oauth_callback_failed")}`);
  }
}
