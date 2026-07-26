import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('renders the hero and its four primary links', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', {
            name: 'Senior software developer building useful digital products.',
        }),
    ).toBeVisible();
    await expect(
        page.getByText(
            'I design and build reliable web applications and AI-enabled solutions, from architecture and hands-on development to production.',
        ),
    ).toBeVisible();

    const links = page
        .getByRole('navigation', { name: "Tommi Lepola's links" })
        .getByRole('link');
    await expect(links).toHaveCount(4);

    for (const name of ['GitHub', 'LinkedIn', 'Email', 'Résumé (PDF)']) {
        await expect(
            page
                .getByRole('navigation', { name: "Tommi Lepola's links" })
                .getByRole('link', { name }),
        ).toHaveAttribute('href', /.+/);
    }
});

test('has visible keyboard focus and does not overflow mobile or desktop viewports', async ({
    page,
}) => {
    for (const viewport of [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
        { width: 900, height: 450 },
    ]) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        expect(
            await page
                .locator('html')
                .evaluate(
                    (element) => element.scrollWidth <= window.innerWidth,
                ),
        ).toBeTruthy();
    }

    const github = page.getByRole('link', { name: 'GitHub' });
    await github.focus();
    await expect(github).toBeFocused();
    await expect(github).toHaveCSS('outline-style', 'solid');
});

test('removes non-essential motion when reduced motion is requested', async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('main')).toHaveCSS('animation-name', 'none');
});

test('has no serious accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toHaveCSS('opacity', '1');

    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
    expect(
        results.violations.filter(({ impact }) => impact === 'serious'),
    ).toEqual([]);
});
