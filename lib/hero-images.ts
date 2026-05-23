/**
 * Hero images from public folder (Whisk_*.jpeg).
 * First 3 = home page slider; rest = other pages' hero sections.
 */
export const HERO_IMAGES = [
  '/hero-bedroom.png',
  '/hero-fridge.png',
  '/hero-sofa.png',
  '/Whisk_0mzn0e2mjvwyxygztujzlfwlif2y00ym1utmtkj.jpeg',
  '/Whisk_mrtn1uwoyywn0cjntm2n1gtl1yto00izlljztuz.jpeg',
  '/Whisk_xewz2kjnivdnmfdntimmihtl4gjz00czjz2ytym.jpeg',
  '/Whisk_2gzmze2m4qzymr2mtity2iwl2iwm00yyzmgnte2.jpeg',
  '/Whisk_4065e68394fcad5821249d7ba1d4a936dr.jpeg',
  '/Whisk_cbd8f0a2aa4293db4da4e6f66890d60edr.jpeg',
  '/Whisk_629a074138a1f1ea2a34c6eb856de2d1dr.jpeg',
  '/Whisk_dc59e126b5601208efb499e94a3fe0c7dr.jpeg',
  '/Whisk_43df2319664f338b5834742afe5425cfdr.jpeg',
  '/Whisk_ygzmiz2nhzzn5u2ytmwzkltlxqmn00ym3mmnty2.jpeg',
  '/Whisk_ljmnjrjzwegzhftmte2nifwlkvzy00ynmldntym.jpeg',
  '/Whisk_180a83c4573234b9c054c48f1befa86edr.jpeg',
  '/Whisk_bba3a7f2239cedfb3c04e3b901749434dr.jpeg',
  '/Whisk_5mzyifgohhjzjzjytqwm1ktl0ywn00snhfgztyw.jpeg',
] as const;

/** Home page slider (first 3) */
export const HERO_SLIDES_HOME = HERO_IMAGES.slice(0, 3);

/** For other pages' hero sections (remaining 14) */
export const HERO_IMAGES_OTHER_PAGES = HERO_IMAGES.slice(3);
