export default (iframe, html, css, cb = () => {}) => {
	iframe.onload = cb;
	iframe.contentWindow.document.open();
	iframe.contentWindow.document.write(html);
	iframe.contentWindow.document.close();

	let style = iframe.contentWindow.document.createElement("style");

	style.innerText = css;
	iframe.contentWindow.document.head.innerHTML = "";
	iframe.contentWindow.document.head.appendChild(style);
};
