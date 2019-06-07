export default function buildElementResizer({ el, wrapper, header }) {
  let isMouseOnElement = false;
  let isMouseOnHeader = false;
  let coveredEdgeOnMouseDown = null;
  let mousePositionOnMouseDown = null;
  let wrapperBoundingClientRect = wrapper.getBoundingClientRect();

  const EDGES = {
    TOP: {
      cursor: 'ns-resize',
      move: (mousePosition) => el.style.setProperty('top', `${wrapperBoundingClientRect.top + mousePosition.yPos}px`),
    },
    LEFT: {
      cursor: 'ew-resize',
      move: (mousePosition) => el.style.setProperty('left', `${wrapperBoundingClientRect.left + mousePosition.xPos}px`),
    },
    BOTTOM: {
      cursor: 'ns-resize',
      move: (mousePosition) => el.style.setProperty('bottom', `${wrapperBoundingClientRect.bottom - mousePosition.yPos}px`),
    },
    RIGHT: {
      cursor: 'ew-resize',
      move: (mousePosition) => el.style.setProperty('right', `${wrapperBoundingClientRect.right - mousePosition.xPos}px`),
    },
    TOP_LEFT: {
      cursor: 'nwse-resize',
      move: (mousePosition) => {
        EDGES.TOP.move(mousePosition);
        EDGES.LEFT.move(mousePosition);
      },
    },
    TOP_RIGHT: {
      cursor: 'nesw-resize',
      move: (mousePosition) => {
        EDGES.TOP.move(mousePosition);
        EDGES.RIGHT.move(mousePosition);
      },
    },
    BOTTOM_LEFT: {
      cursor: 'nesw-resize',
      move: (mousePosition) => {
        EDGES.BOTTOM.move(mousePosition);
        EDGES.LEFT.move(mousePosition);
      },
    },
    BOTTOM_RIGHT: {
      cursor: 'nwse-resize',
      move: (mousePosition) => {
        EDGES.BOTTOM.move(mousePosition);
        EDGES.RIGHT.move(mousePosition);
      },
    },
    HEADER: {
      cursor: 'move',
      move: (mousePosition) => {
        const elBoundingClientRect = el.getBoundingClientRect();
        EDGES.TOP_LEFT.move({
          xPos: elBoundingClientRect.left + mousePosition.movementX,
          yPos: elBoundingClientRect.top + mousePosition.movementY,
        });
        EDGES.BOTTOM_RIGHT.move({
          xPos: elBoundingClientRect.right + mousePosition.movementX,
          yPos: elBoundingClientRect.bottom + mousePosition.movementY,
        });
      }
    }
  };

  el.addEventListener('mousedown', onMouseDown);
  el.addEventListener('mouseenter', onMouseEnter);
  el.addEventListener('mouseleave', onMouseLeave);
  header.addEventListener('mouseenter', onHeaderMouseEnter);
  header.addEventListener('mouseleave', onHeaderMouseLeave);
  wrapper.addEventListener('mouseup', onMouseUp);
  wrapper.addEventListener('mousemove', onMouseMove);

  function onMouseDown(event) {
    coveredEdgeOnMouseDown = getCoveredEdgeByMouse(event);
    mousePositionOnMouseDown = getMousePosition(event);
  }

  function onMouseUp() {
    coveredEdgeOnMouseDown = null;
    mousePositionOnMouseDown = null;
  }

  function onMouseEnter() {
    isMouseOnElement = true;
  }

  function onMouseLeave() {
    isMouseOnElement = false
  }

  function onHeaderMouseEnter() {
    isMouseOnHeader = true;
  }

  function onHeaderMouseLeave() {
    isMouseOnHeader = false;
  }

  function onMouseMove(event) {
    const mousePosition = getMousePosition(event);

    if (coveredEdgeOnMouseDown) {
      coveredEdgeOnMouseDown.move(mousePosition);
    } else {
      const mouseCoveredEdge = getCoveredEdgeByMouse(event);
      setCursorType(mouseCoveredEdge ? mouseCoveredEdge.cursor : 'default');
    }
  }

  function getMousePosition(mouseEvent) {
    return {
      xPos: mouseEvent.clientX - wrapperBoundingClientRect.left,
      yPos: mouseEvent.clientY - wrapperBoundingClientRect.top,
      movementX: mouseEvent.movementX,
      movementY: mouseEvent.movementY
    }
  }

  function getCoveredEdgeByMouse(mouseEvent) {
    if (isMouseOnElement) {
      const margins = 4;
      const elBoundingClientRect = el.getBoundingClientRect();
      const isOnRightEdge = Math.abs(mouseEvent.clientX - elBoundingClientRect.right) <= margins;
      const isOnLeftEdge = Math.abs(mouseEvent.clientX - elBoundingClientRect.left) <= margins;
      const isOnTopEdge = Math.abs(mouseEvent.clientY - elBoundingClientRect.top) <= margins;
      const isOnBottomEdge = Math.abs(mouseEvent.clientY - elBoundingClientRect.bottom) <= margins;

      return (
        isOnTopEdge && isOnLeftEdge ? EDGES.TOP_LEFT :
          isOnTopEdge && isOnRightEdge ? EDGES.TOP_RIGHT :
            isOnBottomEdge && isOnLeftEdge ? EDGES.BOTTOM_LEFT :
              isOnBottomEdge && isOnRightEdge ? EDGES.BOTTOM_RIGHT :
                isOnTopEdge ? EDGES.TOP :
                  isOnRightEdge ? EDGES.RIGHT :
                    isOnLeftEdge ? EDGES.LEFT :
                      isOnBottomEdge ? EDGES.BOTTOM :
                        isMouseOnHeader ? EDGES.HEADER : null
      );
    }
    return null;
  }

  function setCursorType(cursorStyle = 'default') {
    document.body.style.setProperty('cursor', cursorStyle);
  }
}