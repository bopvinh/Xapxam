export const flipVariants = {
  hidden: { rotateY: 180, opacity: 0 },
  visible: { rotateY: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const hitVariants = {
  shake: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};
