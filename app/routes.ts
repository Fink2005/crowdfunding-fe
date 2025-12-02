import {
  type RouteConfig,
  index,
  layout,
  route
} from '@react-router/dev/routes'

export default [
  layout('./layouts/MainLayout.tsx', [
    index('./routes/Home.tsx'),
    route('idea', './routes/Idea.tsx'),
    route('campaign/:id', './routes/CampaignDetail.tsx'),
    route('my-campaigns', './routes/MyCampaigns.tsx'),
    route('learn', './routes/Learn.tsx')
  ])
] satisfies RouteConfig
