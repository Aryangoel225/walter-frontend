export default function SidebarSections({
  sections = [],
  currentQueryId = null,
}) {
  // No query submitted yet or no sections
  if (!currentQueryId || !sections || sections.length === 0) {
    return (
      <div className="text-sm italic opacity-75 flex-1">
        Sections will appear here when a report is generated.
      </div>
    );
  }

  const handleSectionClick = (sectionId) => {
    // TODO: Scroll to section in report
    console.log("Scrolling to section:", sectionId);
  };

  return (
    <div className="flex-1">
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-green-600 rounded transition-colors duration-200"
          >
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );
}
