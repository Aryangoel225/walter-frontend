

export default function Header({ 
  title = "Continuous Intelligence Generator", 
  subtitle = "Enter your intelligence query below" 
}) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold text-green-700 mb-2">
        {title}
      </h1>
      <p className="text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}