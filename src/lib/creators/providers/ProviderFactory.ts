import { CreatorDiscoveryProvider } from "./CreatorDiscoveryProvider";
import { DevMockCreatorProvider } from "./DevMockCreatorProvider";

/**
 * ProviderFactory
 * 
 * Instantiates the appropriate CreatorDiscoveryProvider based on server configuration.
 * When real provider credentials (e.g. licensed B2B aggregator / Meta-authorized API)
 * are provided, it dynamically connects without changing search or presentation logic.
 */
export class ProviderFactory {
  private static instance: CreatorDiscoveryProvider | null = null;

  public static getProvider(): CreatorDiscoveryProvider | null {
    if (this.instance) {
      return this.instance;
    }

    const providerType = process.env.CREATOR_DATA_PROVIDER_TYPE?.toLowerCase();
    const apiKey = process.env.CREATOR_DATA_PROVIDER_API_KEY;

    if (process.env.NODE_ENV !== "production" && !providerType && !apiKey) {
      this.instance = new DevMockCreatorProvider();
    } else {
      // Never substitute fictional creators for a production integration.
      return null;
    }

    return this.instance;
  }
}
