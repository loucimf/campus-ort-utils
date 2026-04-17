(function () {
  const utils = window.campusOrtUtils;
  const managerLinkId = 'ort-manager-nav-link';
  const managerUrl = 'https://ort-manager.vercel.app/';

  function createOptionElement() {
    const icon = document.createElement("i");
    const li = document.createElement('li');
    const div = document.createElement('div');
    const link = document.createElement('a');
    const span = document.createElement('span');

    icon.className = 'material-icons-star center-align';

    span.textContent = 'MANAGER';

    link.href = managerUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(icon);
    link.append(span);

    div.append(link);

    li.append(div);
    li.className = 'sidenav-contenedorIconoySpan';
    li.id = managerLinkId;

    return li;
  }

  function appendManagerLink() {
    const sideNav = document.querySelector('ul.side-nav');

    if (!sideNav || document.getElementById(managerLinkId)) {
      return;
    }

    sideNav.insertBefore(createOptionElement(), sideNav.firstChild);
  }

  utils.appendManagerLink = appendManagerLink;
})();
