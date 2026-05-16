import { GoogleTagManager } from './GoogleTagManager';
import { GoogleAnalytics } from './GoogleAnalytics';
import { NaverAnalytics } from './NaverAnalytics';
import { MicrosoftClarity } from './MicrosoftClarity';
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
      <Hotjar />
      <Mixpanel />
      <ChannelIO />
    </>
  );
}
