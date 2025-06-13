import NotificationBell from "./NotificationBell";

export default function Header({ 
  title = "Continuous Intelligence Generator", 
  subtitle = "Enter your intelligence query below",
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onQueryRerun
}) {
  return (
    <div className="relative w-full">
      <div className="absolute right-0 top-0">
        <NotificationBell 
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          onMarkAllRead={onMarkAllRead}
          onQueryRerun={onQueryRerun}
        />
      </div>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-700 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}