export interface UIFramework {
  id: string
  label: string
  logo: string
}

export const uiFrameworks: UIFramework[] = [
  { id: 'v0', label: 'V0', logo: 'v0.dev' },
  { id: 'shadcn', label: 'shadcn/ui', logo: 'ui.shadcn.com' },
  { id: 'radix', label: 'Radix UI', logo: 'www.radix-ui.com' },
  { id: 'headlessui', label: 'Headless UI', logo: 'headlessui.com' },
  { id: 'tailwind', label: 'Tailwind CSS', logo: 'tailwindcss.com' },
  { id: 'daisyui', label: 'daisyUI', logo: 'daisyui.com' },
  { id: 'chakra', label: 'Chakra UI', logo: 'chakra-ui.com' },
  { id: 'nextui', label: 'Next UI', logo: 'nextui.org' },
  { id: 'mantine', label: 'Mantine', logo: 'mantine.dev' },
  { id: 'mui', label: 'Material UI', logo: 'mui.com' },
  { id: 'antd', label: 'Ant Design', logo: 'ant.design' },
  { id: 'bootstrap', label: 'Bootstrap', logo: 'getbootstrap.com' },
  { id: 'bulma', label: 'Bulma', logo: 'bulma.io' },
  { id: 'semantic', label: 'Semantic UI', logo: 'semantic-ui.com' },
  { id: 'foundation', label: 'Foundation', logo: 'get.foundation' },
  { id: 'primereact', label: 'PrimeReact', logo: 'primereact.org' },
  { id: 'lovable', label: 'Lovable UI', logo: 'lovable.dev' },
  { id: 'flowbite', label: 'Flowbite', logo: 'flowbite.com' },
  { id: 'aceternity', label: 'Aceternity UI', logo: 'ui.aceternity.com' },
  { id: 'magicui', label: 'Magic UI', logo: 'magicui.design' },
  { id: 'react', label: 'React', logo: 'react.dev' },
  { id: 'vue', label: 'Vue', logo: 'vuejs.org' },
  { id: 'svelte', label: 'Svelte', logo: 'svelte.dev' },
  { id: 'custom', label: 'Custom', logo: 'tailwindcss.com' }
]
