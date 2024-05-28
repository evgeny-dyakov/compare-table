(function runCompareTable() {
  const table = document.querySelector('.compare-table');
  const head = table.querySelector('.compare-table__head');
  const stickyHead = table.querySelector('.compare-table__row--sticky');
  const properties = table.querySelector('.compare-table__properties');
  const scrollLines = table.querySelectorAll('.compare-table__scroll-line');
  const arrows = table.querySelectorAll('.compare-table__arrow');
  const seriesCells = table.querySelectorAll('.compare-table__cell--series');
  
  const propertiesElements = table.querySelectorAll('.compare-table__properties .compare-table__cell');
  const dataCellElements = table.querySelectorAll('.compare-table__data .compare-table__cell');
  const dataRowElements = table.querySelectorAll('.compare-table__data .compare-table__row');

  const scrollLineSeries = table.querySelector('.compare-table__scroll-line--series');
  const scrollLineHead = table.querySelector('.compare-table__scroll-line--head');
  const propertiesHead = table.querySelector('.compare-table__properties-head');
  const cellPhoto = table.querySelector('.compare-table__cell--photo');

  const fixedHeader = document.querySelector('#fixed-header');
  
  let dataCellWidth = dataCellElements[0].offsetWidth;
  let scrollLinesWidth = scrollLines[1].scrollWidth;
  let visibleScrollLinesWidth = scrollLines[1].offsetWidth;
  let columnsNum = Math.round(scrollLinesWidth / dataCellWidth);
  let visibleColumnsNum = Math.round(visibleScrollLinesWidth / dataCellWidth);

  let windowHeight = window.innerHeight;

  const arrowsTopStart = parseFloat(getComputedStyle(arrows[0]).top);

  const mobileBreakpoint = 576;

  let scrolledСolumnsNum = 0;

  checkViewportWidth();
  isScrollingEnable();
  setSeriesCells();
  setPropertiesHeadHeight();
  setStickyElementsTop();

  window.addEventListener('scroll', checkStickyHead);
  window.addEventListener('scroll', setArrowsTop);
  table.addEventListener('click', onArrowClick);
  window.addEventListener('resize', updateСarousel);

  function setPropertiesHeadHeight() {
    let propertiesHeadHeight = scrollLineHead.offsetHeight;
    
    if (scrollLineSeries) {
      propertiesHeadHeight += scrollLineSeries.offsetHeight;
    }

    propertiesHead.style.height = `${propertiesHeadHeight}px`;
  }

  function setStickyElementsTop() {
    let stickyElementsTop = cellPhoto.offsetHeight;

    if (fixedHeader) {
      stickyElementsTop -= fixedHeader.offsetHeight;
    }

    if (scrollLineSeries) {
      stickyElementsTop += scrollLineSeries.offsetHeight;
    }
    
    head.style.top = `${-stickyElementsTop}px`;
    propertiesHead.style.top = `${-stickyElementsTop}px`;
  }

  function setSeriesCells() {
    for (const seriesCell of seriesCells) {
      seriesCell.style.width = `${seriesCell.dataset.columns * dataCellWidth}px`;
    }
  }

  function isScrollingEnable() {
    if (columnsNum !== visibleColumnsNum) {
      arrows[1].classList.remove('compare-table__arrow--hidden');
    }
  }

  function checkStickyHead() {
    let top = stickyHead.getBoundingClientRect().top;

    if (fixedHeader) {
      top = Math.round(top - fixedHeader.offsetHeight);
    }

    if (top) {
      head.classList.remove('compare-table__head--shadow');
    } else {
      head.classList.add('compare-table__head--shadow');
    }
  }

  function setArrowsTop() {
    const top = table.getBoundingClientRect().top;

    if (top < 0) {
      const tablePersentOut = -top / table.offsetHeight * 100;

      if (tablePersentOut > 50) {
        return;
      }

      const persent = arrowsTopStart + Math.trunc(tablePersentOut);

      for (const arrow of arrows) {
        arrow.style.top = `${persent}%`;
      }
    }
  }

  function onArrowClick(event) {
    if (event.target.closest('.compare-table__arrow')) {
      if (event.target.closest('.compare-table__arrow--right')) {
        scrolledСolumnsNum++;
      }

      if (event.target.closest('.compare-table__arrow--left')) {
        scrolledСolumnsNum--;
      }

      translateScrollLine(dataCellWidth * scrolledСolumnsNum);

      checkArrowsVisibility();
      checkPropertiesShadow();
    }
  }

  function translateScrollLine(value) {
    for (const scrollLine of scrollLines) {
      scrollLine.style.transform = `translateX(${-value}px)`;
    }
  }

  function checkArrowsVisibility() {
    if (scrolledСolumnsNum === 0) {
      arrows[0].classList.add('compare-table__arrow--hidden');
    } else {
      arrows[0].classList.remove('compare-table__arrow--hidden');
    }

    if (scrolledСolumnsNum === columnsNum - visibleColumnsNum) {
      arrows[1].classList.add('compare-table__arrow--hidden');
    } else {
      arrows[1].classList.remove('compare-table__arrow--hidden');
    }
  }

  function checkPropertiesShadow() {
    if (scrolledСolumnsNum === 0) {
      properties.classList.remove('compare-table__properties--shadow');
    } else {
      properties.classList.add('compare-table__properties--shadow');
    }
  }

  function checkViewportWidth() {
    if (window.innerWidth <= mobileBreakpoint) {
      addPropertiesToDataCells();
      window.addEventListener('resize', checkDesktopWidth);
    } else {
      window.addEventListener('resize', checkMobileWidth);
    }
  }

  function checkDesktopWidth() {
    if (window.innerWidth > mobileBreakpoint) {
      removePropertiesFromDataCells();
      window.removeEventListener('resize', checkDesktopWidth);
      window.addEventListener('resize', checkMobileWidth);
    }
  }

  function checkMobileWidth() {
    if (window.innerWidth <= mobileBreakpoint) {
      addPropertiesToDataCells();
      window.removeEventListener('resize', checkMobileWidth);
      window.addEventListener('resize', checkDesktopWidth);
    }
  }

  function addPropertiesToDataCells() {
    const cellsInRow = dataCellElements.length / dataRowElements.length;

    let cellsInRowCounter = 1;
    let propertiesCounter = 1;

    for (const dataCellElement of dataCellElements) {
      dataCellElement.insertAdjacentHTML('afterbegin', propertiesElements[propertiesCounter - 1].innerHTML);

      if (cellsInRowCounter < cellsInRow) {
        cellsInRowCounter++;
      } else {
        cellsInRowCounter = 1;
        propertiesCounter++;
      }
    }
  }

  function removePropertiesFromDataCells() {
    for (const dataCellElement of dataCellElements) {
      dataCellElement.firstElementChild.remove();
    }
  }

  function updateСarousel() {
    if (windowHeight !== window.innerHeight) {
      windowHeight = window.innerHeight;
      return;
    }

    dataCellWidth = dataCellElements[0].offsetWidth;
    scrollLinesWidth = scrollLines[0].scrollWidth;
    visibleScrollLinesWidth = scrollLines[0].offsetWidth;
    columnsNum = Math.round(scrollLinesWidth / dataCellWidth);
    visibleColumnsNum = Math.round(visibleScrollLinesWidth / dataCellWidth);

    scrolledСolumnsNum = 0;
    translateScrollLine(scrolledСolumnsNum);
    checkArrowsVisibility();
    checkPropertiesShadow();
    setSeriesCells();

    setStickyElementsTop();
  }
})();
