export default function buildElementResizer({ el, wrapper, header, onResize = () => {
} }) {
  let isMouseOnElement = false;
  let isMouseOnHeader = false;
  let coveredEdgeOnMouseDown = null;
  const wrapperBoundingClientRect = wrapper.getBoundingClientRect();
  let elPosition = getElementPosition();

  const EDGES = {
    TOP: {
      cursor: 'ns-resize',
      move: (mouseMovement) => el.style.setProperty(
        'top',
        `${elPosition.top = Math.max(mouseMovement.movementY + elPosition.top, 0)}px`
      ),
    },
    LEFT: {
      cursor: 'ew-resize',
      move: (mouseMovement) => el.style.setProperty(
        'left',
        `${elPosition.left = Math.max(mouseMovement.movementX + elPosition.left, 0)}px`),
    },
    BOTTOM: {
      cursor: 'ns-resize',
      move: (mouseMovement) => el.style.setProperty(
        'bottom',
        `${elPosition.bottom = Math.max(elPosition.bottom - mouseMovement.movementY, 0)}px`
      ),
    },
    RIGHT: {
      cursor: 'ew-resize',
      move: (mouseMovement) => el.style.setProperty(
        'right',
        `${elPosition.right = Math.max(elPosition.right - mouseMovement.movementX, 0)}px`
      ),
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
        const mappedMouseMovement = Object.assign({}, mouseMovement,
          elPosition.left + mouseMovement.movementX <= 0 || elPosition.right - mouseMovement.movementX <= 0 ? { movementX: 0 } : null,
          elPosition.top + mouseMovement.movementY <= 0 || elPosition.bottom - mouseMovement.movementY <= 0 ? { movementY: 0 } : null
        );
        EDGES.TOP_LEFT.move(mappedMouseMovement);
        EDGES.BOTTOM_RIGHT.move(mappedMouseMovement);
      }
    }
  };

  return {
    start() {
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      header.addEventListener('mouseenter', onHeaderMouseEnter);
      header.addEventListener('mouseleave', onHeaderMouseLeave);
      wrapper.addEventListener('mouseup', onMouseUp);
      wrapper.addEventListener('mousemove', onMouseMove);
    },
    stop() {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      header.removeEventListener('mouseenter', onHeaderMouseEnter);
      header.removeEventListener('mouseleave', onHeaderMouseLeave);
      wrapper.removeEventListener('mouseup', onMouseUp);
      wrapper.removeEventListener('mousemove', onMouseMove);
    }
  };

  function onMouseDown(event) {
    coveredEdgeOnMouseDown = getCoveredEdgeByMouse(event);
    if (coveredEdgeOnMouseDown) {
      el.classList.add('moving');
    }
  }

  function onMouseUp() {
    coveredEdgeOnMouseDown = null;
    el.classList.remove('moving');
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
      onResize();
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