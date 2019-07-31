const multiselectDisplay = (id, state) => {
    const toggler = document.querySelector(
        `.js--multiselect__toggler-wrapper--${id}`
    );
    if (state) {
        toggler.classList.add("active");
    } else {
        toggler.classList.remove("active");
    }
};

const buildLozenge = (id, option, active = false) => {
    const isUser = option.sub === active;
    const image = `<div class="multiselect__avatar" style="background-image:url('/assets/images/avatar_${
        option.image_suffix
    }.jpg');"></div>`;
    const subData = option.sub ? `data-${id}-sub="${option.sub}"` : "";
    return `<div class="js--multiselect__item multiselect__item" ${subData}">
                ${isUser ? "" : image}
                <div class="multiselect__title">${option.name} ${
        isUser ? "(You)" : ""
    }</div>
            </div>`;
};

export const buildSelect = (id, options, active) => {
    const selectWrapper = document.querySelector(`.js--multiselect--${id}`);
    const lozenges = options
        .filter(option => option.selected)
        .map((option, i) => buildLozenge(id, option, active));
    if (lozenges.length > 0) {
        selectWrapper.innerHTML = lozenges.join("");
    } else {
        selectWrapper.innerHTML = buildLozenge(id, options[0], active);
        const fallbackToggle = document.querySelector(
            ".js--multiselect__fallback"
        );
        if (fallbackToggle) {
            fallbackToggle.checked = true;
        }
    }

    selectWrapper.addEventListener("click", () => multiselectDisplay(id, true));
};

export const buildSelectToggler = (id, options, active) => {
    const selectTogglerWrapper = document.querySelector(
        `.js--multiselect__toggler--${id}`
    );
    const toggles = options.map(option => {
        const checked =
            option.selected || option.sub === active ? "checked" : "";
        return `
            <div class="multiselect__toggle" data-sub="${option.sub}">
                <div class="check__wrapper">
                    <div class="check">
                        <input
                            type="checkbox"
                            class="check__input js--multiselect__selection ${
                                option.sub === active
                                    ? "js--multiselect__fallback"
                                    : ""
                            }"
                            id="selected__${option.sub}"
                            name="availability"
                            value="${option.sub}"
                            ${checked}
                        >
                        <label
                            for="selected__${option.sub}"
                            class="check__label--sym"
                        ></label>
                    </div>
                    <label
                        for="selected__${option.sub}"
                        class="check__label--visible multiselect__toggle-label"
                    >
                        <div class="multiselect__avatar" style="background-image:url('/assets/images/avatar_${
                            option.image_suffix
                        }.jpg');"></div>
                        ${option.name} ${option.sub === active ? "(You)" : ""}
                    </label>
                </div>
             </div>`;
    });
    selectTogglerWrapper.innerHTML = `${toggles.join("")}`;
};

export const toggleMultiselect = (
    value,
    checked,
    id,
    options,
    callback,
    active
) => {
    const target = options.find(option => option.sub === value);
    target.selected = checked;
    buildSelect(id, options, active);
    callback();
};

export const watchSelectToggler = (id, options, callback, active) => {
    const toggles = document.querySelectorAll(".js--multiselect__selection");
    [...toggles].map(toggle =>
        toggle.addEventListener("change", e =>
            toggleMultiselect(
                e.target.value,
                e.target.checked,
                id,
                options,
                callback,
                active
            )
        )
    );

    const closeButton = document.querySelector(
        `.js--multiselect__toggler-button--${id}`
    );
    closeButton.addEventListener("click", () => multiselectDisplay(id, false));
};

export const clearParticipants = (id, options, active) => {
    const selectWrapper = document.querySelector(`.js--multiselect--${id}`);
    selectWrapper.innerHTML = buildLozenge(id, options[0], active);
};
