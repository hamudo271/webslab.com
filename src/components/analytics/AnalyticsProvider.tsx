import { GoogleTagManager } from './GoogleTagManager';
import { GoogleAnalytics } from './GoogleAnalytics';
import { NaverAnalytics } from './NaverAnalytics';
import { MicrosoftClarity } from './MicrosoftClarity';
import { MetaPixel } from './MetaPixel';
import { KakaoPixel } from './KakaoPixel';
import { Hotjar } from './Hotjar';
import { ChannelIO } from './ChannelIO';
import { Mixpanel } from './Mixpanel';

export function AnalyticsProvider() {
  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <NaverAnalytics />
      <MicrosoftClarity />
      <MetaPixel />
      <KakaoPixel />
      <Hotjar />
      <Mixpanel />
      <ChannelIO />
    </>
  );
}
