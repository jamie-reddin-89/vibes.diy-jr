export interface SessionViewProps {
  sessionId: string;
  pathname: string;
  search: string;
  locationState: unknown;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  urlPrompt: string | null;
  urlModel: string | null;
}
