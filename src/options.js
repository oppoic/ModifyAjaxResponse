let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// 通过标记所选按钮并保存对按钮单击做出反应
// 选择
function handleButtonClick(event) {
    // 从先前选择的颜色中删除样式
    let current = event.target.parentElement.querySelector(
        `.${selectedClassName}`
    );
    if (current && current !== event.target) {
        current.classList.remove(selectedClassName);
    }

    // 将按钮标记为选中
    let color = event.target.dataset.color;
    event.target.classList.add(selectedClassName);
    chrome.storage.sync.set({ color });
}

// 为每种提供的颜色向页面添加一个按钮
function constructOptions(buttonColors) {
    chrome.storage.sync.get("color", (data) => {
        let currentColor = data.color;
        // 对于我们提供的每种颜色......
        for (let buttonColor of buttonColors) {
            // ...创建一个具有该颜色的按钮...
            let button = document.createElement("button");
            button.dataset.color = buttonColor;
            button.style.backgroundColor = buttonColor;

            // …标记当前选择的颜色…
            if (buttonColor === currentColor) {
                button.classList.add(selectedClassName);
            }

            // ..并为单击该按钮时注册一个侦听器
            button.addEventListener("click", handleButtonClick);
            page.appendChild(button);
        }
    });
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);