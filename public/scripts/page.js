const currentPage = location.pathname
const links = document.querySelectorAll('.links a')


for (link of links) {
  if (currentPage.includes(link.getAttribute('href'))) {
    link.classList.add('active')
  }
  else if (currentPage.includes('profile')) {
    links[2].classList.add('active')
  }
}