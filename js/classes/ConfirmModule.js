import { useClickEvent } from "../common/useEvent.js";
import { imgAsBtn } from "../common/render.js";
import { useInputEvent, useSubmitEvent } from "../common/useEvent.js";

export class ConfirmModule {
  constructor(warning, message, target, callback) {
    this.warning = warning;
    this.message = message;
    this.target = target;
    this.callback = callback;

    this.input = null;
    this.searchQuery = "";
    this.module = null;
    this.filter = null;
    this.renderModule();
  }

  renderModule() {
    const parent = document.body;

    const filter = document.createElement("div");

    const container = document.createElement("div");
    const close = imgAsBtn("../../res/icons/x.svg", "Close");
    const header = document.createElement("h2");
    const text = document.createElement("p");

    const form = document.createElement("form");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const formBtns = document.createElement("div");
    const confirmBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    const warning = this.warning;
    const message = this.message;
    const target = this.target;

    filter.setAttribute("class", "confirmModuleFilter");
    container.setAttribute("class", "confirmModuleContainer");
    close.setAttribute("class", "confirmModuleClose");
    header.setAttribute("class", "confirmModuleHeader");
    text.setAttribute("class", "confirmModuleText");

    form.setAttribute("class", "confirmModuleForm");
    input.setAttribute("class", "confirmModuleInput input");
    label.setAttribute("class", "confirmModuleLabel");
    formBtns.setAttribute("class", "confirmModuleFormBtnContainer");
    confirmBtn.setAttribute("class", "confirmModuleConfirmBtn btn");
    cancelBtn.setAttribute("class", "confirmModuleCancelBtn btn");

    header.innerText = warning;
    text.innerText = message;
    close.innerText = "X";
    label.innerText = `If you are sure write '${target}' below and click confirm`;
    confirmBtn.innerText = "Confirm";
    cancelBtn.innerText = "Canel";

    input.setAttribute("id", "confirmInput");
    input.setAttribute("placeholder", "Input confirmation here");
    label.setAttribute("for", "confirmInput");

    confirmBtn.setAttribute("type", "submit");
    cancelBtn.setAttribute("type", "button");

    formBtns.appendChild(confirmBtn);
    formBtns.appendChild(cancelBtn);

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(formBtns);

    container.appendChild(header);
    container.appendChild(close);
    container.appendChild(text);
    container.appendChild(form);

    const removeModule = this.removeModule.bind(this);

    useClickEvent(close, removeModule);
    useClickEvent(cancelBtn, removeModule);

    this.setModule(container);
    this.setFilter(filter);
    this.setForm(form);
    this.setInput(input);

    parent.appendChild(filter);
    parent.appendChild(container);
  }

  setModule(module) {
    this.module = module;
  }

  setFilter(filter) {
    this.filter = filter;
  }

  setInput(input) {
    this.input = input;
    const storeSearchQuery = this.storeSearchQuery.bind(this);
    useInputEvent(this.input, storeSearchQuery);
  }

  setForm(form) {
    this.form = form;
    const validateSearchQuery = this.validateSearchQuery.bind(this);
    useSubmitEvent(form, validateSearchQuery);
  }

  setSearchQuery(setSearchQuery) {
    this.searchQuery = setSearchQuery;
  }

  storeSearchQuery() {
    const input = this.input;
    const inputValue = input.value;
    this.setSearchQuery(inputValue);
  }

  validateSearchQuery() {
    const searchQuery = this.searchQuery;
    const target = this.target;

    if (searchQuery === target) {
      this.callback(target);
      this.removeModule();
    } else {
      this.removeModule();
    }
  }

  removeModule() {
    const module = this.module;
    const filter = this.filter;

    filter.remove();
    module.remove();
  }
}
