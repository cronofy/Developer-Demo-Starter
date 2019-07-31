const tabBlocks = document.querySelectorAll(".js--tabs__wrapper");

const setTab = (controls, items, target) => {
    [...controls].map(control => {
        control.classList.remove("active");
        if (control.dataset.tab === target) {
            control.classList.add("active");
        }
    });
    [...items].map(item => {
        item.classList.remove("active");
        if (item.dataset.tab === target) {
            item.classList.add("active");
        }
    });
};

[...tabBlocks].map(block => {
    const controls = block.querySelectorAll(".js--tabs__control");
    const items = block.querySelectorAll(".js--tabs__item");

    const maxTabHeight = Math.max(
        ...[...items].map(item => {
            const offset = item.scrollHeight;
            item.classList.remove("active");
            return offset;
        })
    );

    const contentWrapper = block.querySelector(".js--tabs__content");
    contentWrapper.style.height = `${maxTabHeight}px`;

    items[0].classList.add("active");

    [...controls].map(control =>
        control.addEventListener("click", e =>
            setTab(controls, items, e.target.dataset.tab)
        )
    );
});
