export default function buildElementResizer({ el, wrapper, header }) {
  let isMouseOnElement = false;
  let isMouseOnHeader = false;
  let coveredEdgeOnMouseDown = null;
  let elPosition = getElementPosition();

  const EDGES = {
    TOP: {
      cursor: 'ns-resize',
      move: (mouseMovement) => el.style.setProperty('top', `${elPosition.top += mouseMovement.movementY}px`),
    },
    LEFT: {
      cursor: 'ew-resize',
      move: (mouseMovement) => el.style.setProperty('left', `${elPosition.left += mouseMovement.movementX}px`),
    },
    BOTTOM: {
      cursor: 'ns-resize',
      move: (mouseMovement) => el.style.setProperty('bottom', `${elPosition.bottom -= mouseMovement.movementY}px`),
    },
    RIGHT: {
      cursor: 'ew-resize',
      move: (mouseMovement) => el.style.setProperty('right', `${elPosition.right -= mouseMovement.movementX}px`),
    },
    TOP_LEFT: {
      cursor: 'nwse-resize',
      move: (mouseMovement) => {
        EDGES.TOP.move(mouseMovement);
        EDGES.LEFT.move(mouseMovement);
      },
    },
    TOP_RIGHT: {
      cursor: 'nesw-resize',
      move: (mouseMovement) => {
        EDGES.TOP.move(mouseMovement);
        EDGES.RIGHT.move(mouseMovement);
      },
    },
    BOTTOM_LEFT: {
      cursor: 'nesw-resize',
      move: (mouseMovement) => {
        EDGES.BOTTOM.move(mouseMovement);
        EDGES.LEFT.move(mouseMovement);
      },
    },
    BOTTOM_RIGHT: {
      cursor: 'nwse-resize',
      move: (mouseMovement) => {
        EDGES.BOTTOM.move(mouseMovement);
        EDGES.RIGHT.move(mouseMovement);
      },
    },
    HEADER: {
      cursor: 'move',
      move: (mouseMovement) => {
        EDGES.TOP_LEFT.move(mouseMovement);
        EDGES.BOTTOM_RIGHT.move(mouseMovement);
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
  }

  function onMouseUp() {
    coveredEdgeOnMouseDown = null;
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
    if (coveredEdgeOnMouseDown) {
      coveredEdgeOnMouseDown.move({
        movementX: event.movementX,
        movementY: event.movementY
      });
    } else {
      const mouseCoveredEdge = getCoveredEdgeByMouse(event);
      setCursorType(mouseCoveredEdge ? mouseCoveredEdge.cursor : 'default');
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

  function getElementPosition() {
    const elBoundingClientRect = el.getBoundingClientRect();
    const wrapperBoundingClientRect = wrapper.getBoundingClientRect();

    return {
      left: elBoundingClientRect.left - wrapperBoundingClientRect.left,
      top: elBoundingClientRect.top - wrapperBoundingClientRect.top,
      right: wrapperBoundingClientRect.right - elBoundingClientRect.right,
      bottom: wrapperBoundingClientRect.bottom - elBoundingClientRect.bottom
    };
  }

  function setCursorType(cursorStyle = 'default') {
    document.body.style.setProperty('cursor', cursorStyle);
  }
}