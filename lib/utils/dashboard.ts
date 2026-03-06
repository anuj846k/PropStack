export const getSeverityBadge = (s: string) =>
  s === "high" ? "destructive" : s === "medium" ? "warning" : "success";
export const getStatusBadge = (s: string) =>
  s === "open" ? "destructive" : s === "in_progress" ? "warning" : "success";
export const getStatusLabel = (s: string) =>
  s === "open" ? "Open" : s === "in_progress" ? "In Progress" : "Resolved";
export const getOutcomeBadge = (o: string) =>
  o === "promise"
    ? "success"
    : o === "no_answer"
      ? "warning"
      : o === "interested"
        ? "default"
        : o === "live"
          ? "secondary"
          : "outline";
export const getOutcomeLabel = (o: string) =>
  o === "promise"
    ? "Payment Promised"
    : o === "no_answer"
      ? "No Answer"
      : o === "interested"
        ? "Interested"
        : o === "live"
          ? "🔴 Live"
          : o === "completed"
            ? "Completed"
            : "—";
export const getSentimentIcon = (s: string) =>
  s === "cooperative"
    ? "😊"
    : s === "positive"
      ? "👍"
      : s === "no_answer"
        ? "📵"
        : s === "live"
          ? "🔴"
          : "😐";
