const SidebarOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
      onClick={onClose}
    />
  )
}

export default SidebarOverlay

