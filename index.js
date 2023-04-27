
window.onload = () => {
  const storage = JSON.parse(localStorage.getItem(`liner_test`));

  if (storage) {
    // innerHTML 교체 후 css style 변경
    const highlight = (color) => {
      console.log('highlight()');
      const highlightElements = document.getElementsByClassName(`saved-liner ${color}`);
      const elementsLength = highlightElements.length;

      for (let i = 0; i < elementsLength; i++) {
        highlightElements[i].style.backgroundColor = color;
      }
    }

    // 하이라이트 된 텍스트 부분 innerHTML 변경
    const replaceHTML = (parent, item) => {
      const {
        prev,
        next,
        highlightText,
        substringHighlight,
        color,
        innerHTML,
      } = item;
      console.log('replaceHTML()', item);

      // const highlightElement = prev + `<span class="saved-liner ${color}">` + highlightText + '</span>' + next;
      const highlightElement = `<span class="saved-liner ${color}">` + highlightText + '</span>';

      // 공백으로 인한 비교 불가 처리
      // prev, next의 공백으로 인해 비교처리가 안되는 경우가 있음.
      const innerText = parent.innerText.replaceAll(' ', '');
      const substrintText = substringHighlight.replaceAll(' ', '');

      if (innerText.includes(substrintText)) {
        parent.innerHTML = parent.innerHTML.replace(innerHTML, highlightElement);
        // parent.innerHTML = parent.innerHTML.replace(highlightText, highlightElement);
        // parent.innerHTML = parent.innerHTML.replace(substringHighlight.trim(), highlightElement.trim());
  
        highlight(color);
      }
    }

    storage.map((item) => {
      const {
        baseURI,
        highlight,
      } = item;

      console.log('storage', item);
      // 현재 페이지의 url과 동일한지 체크
      if (baseURI !== window.location.href) {
        console.log('현재 페이지 하이라이트 없음.');
        return;
      } else {
        highlight.map((el) => {
          // parentId가 있을 경우 parentId parentNode를 찾음.
          // className만 있을 경우 모든 className을 for 돌려서 찾음.
          if (el.parentId !== '') {
            // parentID 값으로 찾기
            const parent = document.getElementById(el.parentId);
      
            replaceHTML(parent, el);
          } else if (el.parentClassName !== '') {
            // parentClassName 값으로 찾기
            const parent = document.getElementsByClassName(el.parentClassName);
            const parentLength = parent.length;
      
            for (let i = 0; i < parentLength; i++) {
              if (parent[i].innerText.includes(el.substringHighlight)) {
                replaceHTML(parent[i], el);
              }
            }
          } else if (el.parentTag !== '') {
            // parentTag 값으로 찾기
            const parent = document.getElementsByTagName(el.parentTag);
            const parentLength = parent.length;
      
            for (let i = 0; i < parentLength; i++) {
              if (parent[i].innerText.includes(el.substringHighlight.trim())) {
                replaceHTML(parent[i], el);
              }
            }
          }
        })
      }
  
    })
  }
}

document.addEventListener('mousedown', (e) => {
  console.log('mousedown');
  const liner = document.getElementsByClassName('liner')[0];
  if (liner) {
    setTimeout(() => {
      removeLinerBtn();
    }, 100);
  }
})

document.addEventListener('mouseup', (e) => {
  console.log('mouseup', e, e.target, e.target.className);
  
  const liner = document.getElementsByClassName('liner')[0];
  if (!liner) {
    executeLiner(e);
  }
})

const removeLinerBtn = () => {
  const liner = document.getElementsByClassName('liner')[0];

  const selObj = window.getSelection();
  const selectedText = selObj.toString();

  // Liner button element가 존재하고 selection된 텍스트가 없는 경우 Remove
  if (liner && selectedText.trim() === '') {
    liner.remove()
  }
}

const executeLiner = (e) => {
  const selObj = window.getSelection();
  const anchorNodeValue = selObj.anchorNode.nodeValue;
  const selRange = selObj.getRangeAt(0);
  console.log('anchorNode', selObj);

  const target = e.target;
  const selectedText = selObj.toString();

  if (selectedText.trim() !== '') {
    // button
    const newDiv = document.createElement('div');
  
    const buttonYellow = document.createElement('div');
    const buttonPink = document.createElement('div');
    const buttonCoral = document.createElement('div');
    const buttonWheat = document.createElement('div');
  
    // liner button create & style
    newDiv.className = 'liner';
    newDiv.style.cssText = highlightBtnWrapStyle;
  
    buttonYellow.className = 'color-yellow';
    buttonYellow.style.cssText = btnYellowStyle;

    buttonPink.className = 'color-pink';
    buttonPink.style.cssText = btnPinkStyle;
    
    buttonWheat.className = 'color-wheat';
    buttonWheat.style.cssText = btnWheatStyle;

    buttonCoral.className = 'color-coral'
    buttonCoral.style.cssText = btnCoralStyle;
  
    newDiv.style.top = `${e.clientY}px`;
    newDiv.style.left = `${e.clientX}px`;
  
    // text block container가 같은 경우에만 liner 버튼 생성
    if (selRange.startContainer === selRange.endContainer) {
      newDiv.appendChild(buttonYellow);
      newDiv.appendChild(buttonPink);
      newDiv.appendChild(buttonWheat);
      newDiv.appendChild(buttonCoral);
  
      // Liner 버튼 새로 생성 전에는 이미 있는 버튼 제거 후 생성
      removeLinerBtn();
      target.append(newDiv);
    }

    const baseURI = e.target.baseURI;

    // liner button onclick event
    const commonClickData = {
      selObj,
      anchorNodeValue,
      selRange,
      target,
      selectedText,
      newDiv,
      baseURI,
    }

    buttonYellow.onclick = (e) => {
      const clickData = {
        ...commonClickData,
        color: 'yellow',
      }

      palleteClick(e, clickData);
    }

    buttonPink.onclick = (e) => {
      const clickData = {
        ...commonClickData,
        color: 'pink',
      }

      palleteClick(e, clickData);
    }

    buttonCoral.onclick = (e) => {
      const clickData = {
        ...commonClickData,
        color: 'coral',
      }

      palleteClick(e, clickData);
    }

    buttonWheat.onclick = (e) => {
      const clickData = {
        ...commonClickData,
        color: 'wheat',
      }

      palleteClick(e, clickData);
    }
  }
}

const palleteClick = (e, clickData) => {
  e.preventDefault();
  e.stopPropagation();

  const {
    selObj,
    anchorNodeValue,
    selRange,
    color,
    newDiv,
    baseURI,
  } = clickData;
  console.log('palleteClickData', clickData);

  const createdAt = new Date().getTime();

  const selected = document.createElement('span');
  selected.className = `saved-liner ${color} t-${createdAt}`;
  selected.setAttribute('style', `background-color: ${color};`);

  selRange.surroundContents(selected);

  const highlightText = selected.innerText;
  const parentNode = selObj.anchorNode.parentNode.parentNode;

  const parentInnerText = anchorNodeValue; // highlight 처리된 텍스트가 포함된 전체 텍스트
  console.log('parentInnerText', parentInnerText);
  const selectedIndex = parentInnerText.indexOf(highlightText); // highlight된 텍스트의 index
  const substringHighlight = parentInnerText.substring(selectedIndex - 10, selectedIndex + highlightText.length + 10);  // highlight 처리된 텍스트 앞뒤로 5글자 자름
  const prev = substringHighlight.substring(0, substringHighlight.indexOf(highlightText));
  const next = substringHighlight.substring(substringHighlight.indexOf(highlightText) + highlightText.length, substringHighlight.length);

  const data = {
    highlightText,
    prev,
    next,
    createdAt,
    parentClassName: parentNode.className,
    parentId: parentNode.id,
    parentTag: parentNode.tagName,
    substringHighlight,
    color,
    innerHTML: document.getElementsByClassName(`t-${createdAt}`)[0].innerHTML,
  };
  console.log('savedData', data);

  const storage = JSON.parse(localStorage.getItem(`liner_test`));
  let saved = storage || [];
  if (saved.length === 0) {
    saved = [{
      baseURI,
      highlight: [
        data
      ]
    }];
  } else {
    const exist = saved.filter((item) => item.baseURI === baseURI)[0];
    if (exist) {
      saved.map((item, i) => {
        if (item.baseURI === baseURI) {
          const highlightTemp = saved[i].highlight;
          highlightTemp.push(data);
          console.log('saved', saved);
        }
      })
    } else {
      saved.push({
        baseURI,
        highlight: [
          data
        ]
      });
    }
  }

  localStorage.setItem('liner_test', JSON.stringify(saved));

  newDiv.remove();

  // selected.onclick = (e) => {
  //   console.log('selected click', e);
  //   alert(e.target.innerText);
  // }
}

postCreateHighlight = () => {
  fetch('https://highlighterdev.realsangil.net/v1/pages', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer X)xA[:avOsy01zvPrTrF:`VFzu_6D&1T"
    }
  })
    .then((response) => console.log(response))
    .then((data) => console.log(data));
}

const highlightBtnWrapStyle = `
  display: flex;
  position: fixed;
  color: #fff;
  border-radius: 20px;
  margin: 8px;
  z-index: 99999;
  padding: 4px !important;
  border: 1px solid #eee;
  background-color: #fff;
  width: 120px;
  justify-content: space-between;
  box-shadow: rgb(0 0 0 / 30%) 0px 4px 10px 0px;
`;

const btnPinkStyle = `
  background-color: pink;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  cursor: pointer;
`;
  
const btnYellowStyle = `
  background-color: yellow;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  cursor: pointer;
`;

const btnWheatStyle = `
  background-color: wheat;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  cursor: pointer;
`;

const btnCoralStyle = `
  background-color: coral;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  cursor: pointer;
`;