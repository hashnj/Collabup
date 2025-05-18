
interface LayoutWidths {
  whiteboard: string;
  codeEditor: string;
  video: string;
}

const getLayoutWidths = (
  whiteboardVisible: boolean,
  codeEditorVisible: boolean
): LayoutWidths => {
  if (whiteboardVisible && codeEditorVisible)
    return { whiteboard: "w-2/5", codeEditor: "w-2/5", video: "w-1/5" };
  if (whiteboardVisible)
    return { whiteboard: "w-[70%]", codeEditor: "hidden", video: "w-[30%]" };
  if (codeEditorVisible)
    return { whiteboard: "hidden", codeEditor: "w-[70%]", video: "w-[30%]" };
  return { whiteboard: "hidden", codeEditor: "hidden", video: "w-full" };
};
  export default getLayoutWidths;