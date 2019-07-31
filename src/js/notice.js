const noticeToggle = document.querySelector(".js--notice__clear");
const notice = document.querySelector(".js--notice");
if (noticeToggle) {
    noticeToggle.addEventListener("click", () =>
        notice.classList.add("hidden")
    );
}
