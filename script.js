const siteHeader = document.querySelector('#site-header');

const updateHeader = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 4);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const contributorList = document.querySelector('#contributors-list');

if (contributorList) {
  fetch('https://api.github.com/repos/mohu-org/mohu/contributors?per_page=100', {
    headers: { Accept: 'application/vnd.github+json' },
  })
    .then((response) => {
      if (!response.ok) throw new Error('Contributor list unavailable');
      return response.json();
    })
    .then((contributors) => {
      if (!Array.isArray(contributors) || contributors.length === 0) return;

      const items = contributors.flatMap((contributor) => {
        if (!contributor.login || !contributor.avatar_url) return [];
        const avatar = new URL(contributor.avatar_url);
        if (avatar.hostname !== 'avatars.githubusercontent.com') return [];

        const item = document.createElement('li');
        const profile = document.createElement('a');
        profile.className = 'contributor';
        profile.href = `https://github.com/${encodeURIComponent(contributor.login)}`;
        profile.setAttribute('aria-label', `${contributor.login} on GitHub`);

        const image = document.createElement('img');
        image.src = avatar.href;
        image.alt = '';
        image.width = 28;
        image.height = 28;
        image.loading = 'lazy';
        image.decoding = 'async';

        const name = document.createElement('span');
        name.textContent = contributor.login;

        profile.append(image, name);
        item.append(profile);
        return [item];
      });

      if (items.length > 0) contributorList.replaceChildren(...items);
    })
    .catch(() => {
      // Keep the commit-history names already in the page if GitHub is unavailable.
    });
}
