import { initGA, initGoogleAds, logEvent } from './analytics';
import ReactGA from 'react-ga4';

vi.mock('react-ga4');

describe('Analytics Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset window.gtag
        delete window.gtag;
        // Reset Google Ads ID
        import.meta.env.VITE_GOOGLE_ADS_ID = 'AW-TEST';
    });

    test('initGA initializes only if not already initialized', () => {
        // Mock ReactGA.isInitialized to be false initially
        Object.defineProperty(ReactGA, 'isInitialized', { value: false, writable: true });

        initGA();
        expect(ReactGA.initialize).toHaveBeenCalled();

        // Mock initialized = true
        Object.defineProperty(ReactGA, 'isInitialized', { value: true, writable: true });
        initGA();
        expect(ReactGA.initialize).toHaveBeenCalledTimes(1);
    });

    test('logEvent calls ReactGA only if initialized', () => {
        Object.defineProperty(ReactGA, 'isInitialized', { value: false, writable: true });
        logEvent('Test', 'Click', 'Label');
        expect(ReactGA.event).not.toHaveBeenCalled();

        Object.defineProperty(ReactGA, 'isInitialized', { value: true, writable: true });
        logEvent('Test', 'Click', 'Label');
        expect(ReactGA.event).toHaveBeenCalledWith({ category: 'Test', action: 'Click', label: 'Label' });
    });
});
