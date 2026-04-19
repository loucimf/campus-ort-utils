import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@styles/variables.css';
import './styles.css';
import "@styles/library.css"
import { Sidebar } from './main-components/Sidebar';
import { HorizontalContainer } from './design/system/containers';
import { designSystem } from './design/system/designSystem';
import { MainTab } from './main-components/MainTab';
import { Dashboard } from './main-components/tabs/Dashboard';
import { BodyText, Eyebrow, PageTitle } from './components/Texts';

document.documentElement.dataset.theme = 'light';

export interface Tab {
	id: string;
	label: string;
	content: React.ReactNode;
}

const greetPage = (
	<section className="panel">
		<Eyebrow>Campus ORT utilities</Eyebrow>
		<PageTitle>ORT Manager</PageTitle>
		<BodyText tone="secondary" style={{ maxWidth: "520px", marginTop: designSystem.units.md }}>
			Build tools for Campus workflows from one React and TypeScript app.
		</BodyText>
	</section>
)

function App() {

	const tabs: Tab[] = [
		{ id: 'dashboard', label: 'Dashboard', content: <Dashboard padding={designSystem.units.lg} /> },
		{ id: 'history', label: 'History', content: <BodyText tone="secondary">Coming soon..</BodyText> },
		{ id: 'reports', label: 'Reports', content: <BodyText tone="secondary">Coming soon..</BodyText> },
	];

	const [currentTab, setCurrentTab] = useState<Tab>(tabs[0]);

	return (
		<main className="width-view height-view">
			{false ? greetPage : null}
			<HorizontalContainer height={"100%"} gap={"0px"} backgroundColor={designSystem.colors.background}>
				<Sidebar width={designSystem.sizes.sidebar} tabs={tabs} setCurrentTab={setCurrentTab} currentTab={currentTab} />
				<MainTab content={currentTab.content} width={designSystem.sizes.ninety}/>
			</HorizontalContainer>
		</main>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
