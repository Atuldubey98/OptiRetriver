import React, { useState } from "react";

export default function useDisclosure({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const onToggle = () => setOpen((o) => !o);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  return { onOpen, onToggle, onClose, open };
}
