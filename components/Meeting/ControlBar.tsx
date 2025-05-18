const ControlButton = ({
    onIcon: OnIcon,
    offIcon: OffIcon,
    onClick,
    active = true,
  }: any) => (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
        active ? "bg-gray-700 text-white" : "bg-gray-500 text-gray-300"
      }`}
    >
      {active || !OffIcon ? (
        <OnIcon className="w-6 h-6" />
      ) : (
        <OffIcon className="w-6 h-6" />
      )}
    </button>
  );
export default ControlButton;
