'use strict';

// The complete bibliography is ordinary HTML and stays readable without JavaScript.
const tools = document.querySelector('.research-tools');
const papers = [...document.querySelectorAll('.paper')];
const filters = [...document.querySelectorAll('.filter')];
const search = document.querySelector('#paper-search');
const status = document.querySelector('#result-status');
const empty = document.querySelector('.empty-state');
let selected = 'all';

function normalize(text) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function updatePapers() {
  const query = normalize(search.value).trim();
  let visible = 0;
  for (const paper of papers) {
    const matchesStatus = selected === 'all' || paper.dataset.status === selected;
    const matchesQuery = normalize(paper.textContent).includes(query);
    paper.hidden = !(matchesStatus && matchesQuery);
    if (!paper.hidden) visible++;
  }
  empty.hidden = visible !== 0;
  status.textContent = `${visible} ${visible === 1 ? 'paper' : 'papers'} shown${query ? ` for “${search.value.trim()}”` : ''}.`;
  for (const filter of filters) {
    const active = filter.dataset.filter === selected;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  }
}

for (const filter of filters) {
  const category = filter.dataset.filter;
  filter.querySelector('span').textContent = category === 'all' ? papers.length : papers.filter(paper => paper.dataset.status === category).length;
  filter.addEventListener('click', () => {
    selected = category;
    updatePapers();
  });
}
search.addEventListener('input', updatePapers);
document.querySelector('#reset-filters').addEventListener('click', () => {
  selected = 'all';
  search.value = '';
  updatePapers();
  search.focus();
});
tools.hidden = false;
