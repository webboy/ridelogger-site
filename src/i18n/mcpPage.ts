import type { Locale } from './config';
import type { McpPageMessages } from '../types/mcpPage';

const EN: McpPageMessages = {
	meta: {
		title: 'RideLogger MCP connector for Claude',
		description:
			'Connect Claude to RideLogger through the public MCP server to read and manage vehicle logs, costs, reminders, files, photos, and documents.',
	},
	hero: {
		eyebrow: 'Claude MCP connector',
		title: 'Manage your vehicle logbook from Claude',
		lead:
			'RideLogger MCP connects Claude to your authorized vehicle data so you can ask questions, create log entries, upload files, and keep maintenance reminders up to date from conversation.',
		primaryCta: 'Open RideLogger',
		secondaryCta: 'Privacy policy',
	},
	connection: {
		title: 'Connection details',
		body:
			'Users connect with OAuth 2.0 and authorize Claude to access only their own RideLogger account. No admin or developer seat is required.',
		endpointLabel: 'MCP server',
		transportLabel: 'Transport',
		transportValue: 'Streamable HTTP',
		authLabel: 'Authentication',
		authValue: 'OAuth 2.0 / Bearer token',
	},
	tools: {
		title: 'Available MCP tools',
		intro:
			'The connector exposes structured tools backed by the official RideLogger API. Destructive delete tools are marked with safety annotations so Claude can ask for confirmation.',
		groups: [
			{
				title: 'Vehicles and plates',
				body: 'Read, create, and update vehicles, including make/model details, mileage units, fuel or energy setup, labels, and plate history.',
				tools: ['vehicles_list', 'vehicles_get', 'vehicles_create', 'vehicles_update', 'vehicle_plates_list/create/update/delete'],
			},
			{
				title: 'Fuel, EV charging, service, and expense logs',
				body: 'List, create, inspect, update, and delete real vehicle history rows. Monetary rows keep their original currency so totals can be normalized safely.',
				tools: ['fuel_logs_*', 'charge_logs_*', 'service_logs_*', 'expense_logs_*', 'generic_vehicle_logs_list/delete'],
			},
			{
				title: 'Files, photos, and vehicle cabinet',
				body: 'Attach receipts or documents to logs, upload vehicle gallery photos, and manage private vehicle cabinet documents such as registration, insurance, and inspection files.',
				tools: ['vehicle_log_files_*', 'vehicle_images_*', 'vehicle_cabinet_*'],
			},
			{
				title: 'Maintenance reminders',
				body: 'Create, update, complete, list, and delete reminders for mileage-based or date-based maintenance tasks.',
				tools: ['reminder_slots_list', 'reminder_list', 'reminder_show', 'reminder_create/update/complete/delete'],
			},
			{
				title: 'Account settings, reference data, and tool policy',
				body: 'Read the connected account profile and preferred currency with auth_me, plus cached reference data such as countries, currencies, fuel units, vehicle types, service types, and machine-readable tool safety semantics.',
				tools: ['auth_me', 'ridelogger://reference/*', 'ridelogger://policy/tool-semantics', 'reference_data_refresh'],
			},
		],
	},
	safety: {
		title: 'Privacy and safety',
		items: [
			'Claude receives only the RideLogger data needed for the action the user requests.',
			'The public connector uses OAuth/Bearer authorization; username and password tools are not exposed.',
			'All transport is over HTTPS/TLS and data access is scoped to the connected RideLogger account.',
			'The connector does not serve sponsored content or advertisements.',
		],
	},
	examples: {
		title: 'Example prompts',
		items: [
			{ title: 'Service history', prompt: 'Summarize all service work for my Toyota this year and show the total cost.' },
			{ title: 'Fuel log', prompt: 'Log 42 liters of fuel today, 68 EUR total, odometer 142300 km.' },
			{ title: 'Reminder', prompt: 'Create a reminder to change the oil in 10,000 km for my main vehicle.' },
			{ title: 'Documents', prompt: 'Attach this invoice to my latest service log and save the registration document in the vehicle cabinet.' },
		],
	},
};

const DE: McpPageMessages = {
	...EN,
	meta: {
		title: 'RideLogger MCP-Konnektor für Claude',
		description:
			'Verbinden Sie Claude über den öffentlichen MCP-Server mit RideLogger, um Fahrzeughistorie, Kosten, Erinnerungen, Dateien, Fotos und Dokumente zu verwalten.',
	},
	hero: {
		eyebrow: 'Claude MCP-Konnektor',
		title: 'Ihr Fahrzeug-Logbuch direkt aus Claude verwalten',
		lead:
			'RideLogger MCP verbindet Claude mit Ihren autorisierten Fahrzeugdaten, damit Sie Fragen stellen, Einträge erstellen, Dateien hochladen und Wartungserinnerungen per Unterhaltung pflegen können.',
		primaryCta: 'RideLogger öffnen',
		secondaryCta: 'Datenschutzerklärung',
	},
	connection: {
		title: 'Verbindungsdetails',
		body:
			'Nutzer verbinden sich per OAuth 2.0 und autorisieren Claude nur für den Zugriff auf das eigene RideLogger-Konto. Ein Admin- oder Entwicklerplatz ist nicht erforderlich.',
		endpointLabel: 'MCP-Server',
		transportLabel: 'Transport',
		transportValue: 'Streamable HTTP',
		authLabel: 'Authentifizierung',
		authValue: 'OAuth 2.0 / Bearer-Token',
	},
	tools: {
		title: 'Verfügbare MCP-Tools',
		intro:
			'Der Konnektor stellt strukturierte Tools bereit, die auf der offiziellen RideLogger API basieren. Lösch-Tools sind mit Sicherheitsannotationen markiert, damit Claude eine Bestätigung anfordern kann.',
		groups: [
			{ ...EN.tools.groups[0], title: 'Fahrzeuge und Kennzeichen', body: 'Fahrzeuge lesen, erstellen und aktualisieren, inklusive Marke/Modell, Kilometerstandseinheiten, Kraftstoff- oder Energieeinstellungen, Labels und Kennzeichenhistorie.' },
			{ ...EN.tools.groups[1], title: 'Tank-, Lade-, Service- und Kosteneinträge', body: 'Echte Fahrzeughistorie auflisten, erstellen, anzeigen, aktualisieren und löschen. Geldbeträge behalten ihre ursprüngliche Währung, damit Summen sauber normalisiert werden können.' },
			{ ...EN.tools.groups[2], title: 'Dateien, Fotos und Fahrzeug-Archiv', body: 'Rechnungen oder Dokumente an Einträge anhängen, Fahrzeugfotos hochladen und private Fahrzeugdokumente wie Zulassung, Versicherung oder Prüfberichte verwalten.' },
			{ ...EN.tools.groups[3], title: 'Wartungserinnerungen', body: 'Erinnerungen für kilometer- oder datumsbasierte Wartungsaufgaben erstellen, aktualisieren, abschließen, auflisten und löschen.' },
			{ ...EN.tools.groups[4], title: 'Kontoeinstellungen, Referenzdaten und Tool-Richtlinien', body: 'Das verbundene Kontoprofil und die bevorzugte Währung mit auth_me lesen, zusätzlich zwischengespeicherte Referenzdaten wie Länder, Währungen, Einheiten, Fahrzeugtypen, Servicetypen und maschinenlesbare Tool-Sicherheitssemantik.' },
		],
	},
	safety: {
		title: 'Datenschutz und Sicherheit',
		items: [
			'Claude erhält nur RideLogger-Daten, die für die vom Nutzer angeforderte Aktion benötigt werden.',
			'Der öffentliche Konnektor nutzt OAuth/Bearer-Autorisierung; Benutzername/Passwort-Tools werden nicht angeboten.',
			'Die Übertragung erfolgt über HTTPS/TLS und der Zugriff ist auf das verbundene RideLogger-Konto beschränkt.',
			'Der Konnektor zeigt keine gesponserten Inhalte oder Werbung an.',
		],
	},
	examples: {
		title: 'Beispiel-Prompts',
		items: [
			{ title: 'Servicehistorie', prompt: 'Fasse alle Servicearbeiten für meinen Toyota in diesem Jahr zusammen und zeige die Gesamtkosten.' },
			{ title: 'Tankeintrag', prompt: 'Trage heute 42 Liter Kraftstoff ein, 68 EUR gesamt, Kilometerstand 142300 km.' },
			{ title: 'Erinnerung', prompt: 'Erstelle eine Erinnerung für den Ölwechsel in 10.000 km für mein Hauptfahrzeug.' },
			{ title: 'Dokumente', prompt: 'Hänge diese Rechnung an meinen letzten Serviceeintrag und speichere den Zulassungsschein im Fahrzeug-Archiv.' },
		],
	},
};

const SR_LATN: McpPageMessages = {
	...EN,
	meta: {
		title: 'Servisna Knjižica MCP konektor za Claude',
		description:
			'Povežite Claude sa Servisnom Knjižicom preko javnog MCP servera za vozila, troškove, podsetnike, fajlove, fotografije i dokumenta.',
	},
	hero: {
		eyebrow: 'Claude MCP konektor',
		title: 'Vodite servisnu istoriju vozila direktno iz Claude-a',
		lead:
			'MCP konektor povezuje Claude sa autorizovanim podacima iz Servisne Knjižice, tako da možete postavljati pitanja, unositi zapise, dodavati fajlove i održavati servisne podsetnike kroz razgovor.',
		primaryCta: 'Otvori aplikaciju',
		secondaryCta: 'Politika privatnosti',
	},
	connection: {
		title: 'Detalji povezivanja',
		body:
			'Korisnik se povezuje preko OAuth 2.0 toka i odobrava Claude-u pristup samo sopstvenom nalogu. Admin ili developer nalog nije potreban.',
		endpointLabel: 'MCP server',
		transportLabel: 'Transport',
		transportValue: 'Streamable HTTP',
		authLabel: 'Autentikacija',
		authValue: 'OAuth 2.0 / Bearer token',
	},
	tools: {
		title: 'Dostupni MCP alati',
		intro:
			'Konektor izlaže strukturisane alate iza zvaničnog API-ja. Alati za brisanje imaju sigurnosne oznake kako bi Claude mogao da traži potvrdu.',
		groups: [
			{ ...EN.tools.groups[0], title: 'Vozila i tablice', body: 'Čitanje, kreiranje i izmena vozila, uključujući marku/model, jedinice kilometraže, gorivo ili energiju, oznake i istoriju tablica.' },
			{ ...EN.tools.groups[1], title: 'Gorivo, EV punjenje, servisi i troškovi', body: 'Listanje, kreiranje, pregled, izmena i brisanje stvarnih zapisa istorije vozila. Novčani zapisi čuvaju originalnu valutu radi tačnog sabiranja.' },
			{ ...EN.tools.groups[2], title: 'Fajlovi, slike i ormarić vozila', body: 'Dodavanje računa i dokumenata uz zapise, upload slika vozila i upravljanje privatnim dokumentima kao što su registracija, osiguranje i tehnički pregled.' },
			{ ...EN.tools.groups[3], title: 'Servisni podsetnici', body: 'Kreiranje, izmena, završavanje, listanje i brisanje podsetnika po kilometraži ili datumu.' },
			{ ...EN.tools.groups[4], title: 'Podešavanja naloga, referentni podaci i politika alata', body: 'Čitanje profila povezanog naloga i preferirane valute kroz auth_me, uz keširane referentne podatke kao što su zemlje, valute, jedinice, tipovi vozila, tipovi servisa i mašinski čitljiva sigurnosna semantika alata.' },
		],
	},
	safety: {
		title: 'Privatnost i sigurnost',
		items: [
			'Claude dobija samo podatke koji su potrebni za akciju koju korisnik traži.',
			'Javni konektor koristi OAuth/Bearer autorizaciju; alati za korisničko ime i lozinku nisu izloženi.',
			'Saobraćaj ide preko HTTPS/TLS, a pristup je ograničen na povezani nalog.',
			'Konektor ne prikazuje sponzorisani sadržaj niti reklame.',
		],
	},
	examples: {
		title: 'Primeri promptova',
		items: [
			{ title: 'Servisna istorija', prompt: 'Sažmi sve servise za moju Toyotu ove godine i prikaži ukupan trošak.' },
			{ title: 'Gorivo', prompt: 'Upiši 42 litra goriva danas, ukupno 68 EUR, kilometraža 142300 km.' },
			{ title: 'Podsetnik', prompt: 'Napravi podsetnik za zamenu ulja za 10.000 km za moje glavno vozilo.' },
			{ title: 'Dokumenta', prompt: 'Dodaj ovaj račun uz poslednji servisni zapis i sačuvaj saobraćajnu dozvolu u ormariću vozila.' },
		],
	},
};

const HR: McpPageMessages = {
	...SR_LATN,
	meta: {
		title: 'Servisna Knjižica MCP konektor za Claude',
		description:
			'Povežite Claude sa Servisnom Knjižicom preko javnog MCP servera za vozila, troškove, podsjetnike, datoteke, fotografije i dokumente.',
	},
	hero: {
		...SR_LATN.hero,
		title: 'Vodite servisnu povijest vozila izravno iz Claudea',
		lead:
			'MCP konektor povezuje Claude s autoriziranim podacima iz Servisne Knjižice, tako da možete postavljati pitanja, unositi zapise, dodavati datoteke i održavati servisne podsjetnike kroz razgovor.',
	},
	tools: {
		...SR_LATN.tools,
		title: 'Dostupni MCP alati',
	},
	safety: {
		...SR_LATN.safety,
		title: 'Privatnost i sigurnost',
	},
};

const MK: McpPageMessages = {
	...EN,
	meta: {
		title: 'Servisna Knjižica MCP конектор за Claude',
		description:
			'Поврзете го Claude со Servisna Knjižica преку јавниот MCP сервер за возила, трошоци, потсетници, датотеки, фотографии и документи.',
	},
	hero: {
		eyebrow: 'Claude MCP конектор',
		title: 'Водете ја сервисната историја директно од Claude',
		lead:
			'MCP конекторот го поврзува Claude со вашите авторизирани податоци за возила, за да поставувате прашања, внесувате записи, додавате датотеки и одржувате потсетници преку разговор.',
		primaryCta: 'Отвори апликација',
		secondaryCta: 'Политика за приватност',
	},
	connection: {
		...SR_LATN.connection,
		title: 'Детали за поврзување',
		body:
			'Корисникот се поврзува преку OAuth 2.0 и му дозволува на Claude пристап само до сопствената сметка. Не е потребно администраторско или developer место.',
	},
	tools: {
		...SR_LATN.tools,
		title: 'Достапни MCP алатки',
	},
	safety: {
		...SR_LATN.safety,
		title: 'Приватност и безбедност',
	},
	examples: {
		...SR_LATN.examples,
		title: 'Примери за prompt',
	},
};

const FR: McpPageMessages = {
	...EN,
	meta: {
		title: 'Connecteur MCP RideLogger pour Claude',
		description:
			'Connectez Claude à RideLogger via le serveur MCP public pour gérer véhicules, coûts, rappels, fichiers, photos et documents.',
	},
	hero: {
		eyebrow: 'Connecteur MCP Claude',
		title: 'Gérez votre carnet véhicule depuis Claude',
		lead:
			'RideLogger MCP connecte Claude à vos données véhicule autorisées afin de poser des questions, créer des entrées, ajouter des fichiers et suivre les rappels d’entretien par conversation.',
		primaryCta: 'Ouvrir RideLogger',
		secondaryCta: 'Politique de confidentialité',
	},
	connection: {
		...EN.connection,
		title: 'Détails de connexion',
		body:
			'Les utilisateurs se connectent avec OAuth 2.0 et autorisent Claude à accéder uniquement à leur propre compte RideLogger. Aucun accès administrateur ou développeur n’est requis.',
		authValue: 'OAuth 2.0 / jeton Bearer',
	},
	tools: {
		...EN.tools,
		title: 'Outils MCP disponibles',
		intro:
			'Le connecteur expose des outils structurés basés sur l’API officielle RideLogger. Les outils destructifs sont annotés pour que Claude puisse demander confirmation.',
	},
	safety: {
		...EN.safety,
		title: 'Confidentialité et sécurité',
	},
	examples: {
		...EN.examples,
		title: 'Exemples de prompts',
	},
};

const IT: McpPageMessages = {
	...EN,
	meta: {
		title: 'Connettore MCP RideLogger per Claude',
		description:
			'Collega Claude a RideLogger tramite il server MCP pubblico per gestire veicoli, costi, promemoria, file, foto e documenti.',
	},
	hero: {
		eyebrow: 'Connettore MCP Claude',
		title: 'Gestisci il libretto del veicolo da Claude',
		lead:
			'RideLogger MCP collega Claude ai dati autorizzati del tuo veicolo per fare domande, creare registrazioni, caricare file e mantenere aggiornati i promemoria di manutenzione.',
		primaryCta: 'Apri RideLogger',
		secondaryCta: 'Informativa privacy',
	},
	connection: {
		...EN.connection,
		title: 'Dettagli di connessione',
		body:
			'Gli utenti si collegano con OAuth 2.0 e autorizzano Claude ad accedere solo al proprio account RideLogger. Non è richiesto un account amministratore o sviluppatore.',
		authValue: 'OAuth 2.0 / token Bearer',
	},
	tools: { ...EN.tools, title: 'Strumenti MCP disponibili' },
	safety: { ...EN.safety, title: 'Privacy e sicurezza' },
	examples: { ...EN.examples, title: 'Esempi di prompt' },
};

const SL: McpPageMessages = {
	...EN,
	meta: {
		title: 'RideLogger MCP povezovalnik za Claude',
		description:
			'Povežite Claude z RideLoggerjem prek javnega MCP strežnika za upravljanje vozil, stroškov, opomnikov, datotek, fotografij in dokumentov.',
	},
	hero: {
		eyebrow: 'Claude MCP povezovalnik',
		title: 'Upravljajte servisno knjižico vozila iz Claude',
		lead:
			'RideLogger MCP poveže Claude z vašimi odobrenimi podatki o vozilih, da lahko zastavljate vprašanja, ustvarjate zapise, nalagate datoteke in urejate opomnike za vzdrževanje.',
		primaryCta: 'Odpri RideLogger',
		secondaryCta: 'Pravilnik o zasebnosti',
	},
	connection: {
		...EN.connection,
		title: 'Podrobnosti povezave',
		body:
			'Uporabniki se povežejo z OAuth 2.0 in Claude pooblastijo samo za dostop do lastnega računa RideLogger. Skrbniški ali razvijalski sedež ni potreben.',
		authValue: 'OAuth 2.0 / Bearer žeton',
	},
	tools: { ...EN.tools, title: 'Razpoložljiva MCP orodja' },
	safety: { ...EN.safety, title: 'Zasebnost in varnost' },
	examples: { ...EN.examples, title: 'Primeri pozivov' },
};

const byLocale: Record<Locale, McpPageMessages> = {
	en: EN,
	de: DE,
	fr: FR,
	it: IT,
	sl: SL,
	hr: HR,
	mk: MK,
	'sr-latn': SR_LATN,
	'sr-cyrl': SR_LATN,
	tr: EN,
	uk: EN,
	pl: EN,
};

export function getMcpPageMessages(locale: Locale): McpPageMessages {
	return byLocale[locale];
}

export function getAllMcpPageMessages(): Record<Locale, McpPageMessages> {
	return { ...byLocale };
}
