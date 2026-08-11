import { SearchX } from "lucide-react";

export const EmptyState = ({
  title,
  message,
  action
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => (
  <div className="empty-state">
    <SearchX size={34} />
    <h2>{title}</h2>
    <p>{message}</p>
    {action}
  </div>
);
