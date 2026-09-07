create unique index
if not exists conversations_brand_campaign_creator_unique
on public.conversations
(brand_id, campaign_id, creator_id)
where campaign_id is not null and creator_id is not null;

