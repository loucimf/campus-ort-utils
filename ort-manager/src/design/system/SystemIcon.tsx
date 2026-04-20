import type { CSSProperties } from "react";
import BellIcon from "@assets/SVGs/DesignSystem/bell.svg?react";
import BankIcon from "@assets/SVGs/DesignSystem/bank.svg?react";
import BuildingIcon from "@assets/SVGs/DesignSystem/building.svg?react";
import CalendarIcon from "@assets/SVGs/DesignSystem/calendar.svg?react";
import CameraIcon from "@assets/SVGs/DesignSystem/camera.svg?react";
import CheckIcon from "@assets/SVGs/DesignSystem/check.svg?react";
import ChartIcon from "@assets/SVGs/DesignSystem/chart.svg?react";
import Chart2Icon from "@assets/SVGs/DesignSystem/chart2.svg?react";
import ChevronIcon from "@assets/SVGs/DesignSystem/chevron.svg?react";
import ClockIcon from "@assets/SVGs/DesignSystem/clock.svg?react";
import DarkModeIcon from "@assets/SVGs/DesignSystem/dark_mode.svg?react";
import DashboardIcon from "@assets/SVGs/DesignSystem/dashboard.svg?react";
import DeleteIcon from "@assets/SVGs/DesignSystem/delete.svg?react";
import DownloadIcon from "@assets/SVGs/DesignSystem/download.svg?react";
import EditIcon from "@assets/SVGs/DesignSystem/edit.svg?react";
import EyeIcon from "@assets/SVGs/DesignSystem/eye.svg?react";
import FaceIcon from "@assets/SVGs/DesignSystem/face.svg?react";
import FinderIcon from "@assets/SVGs/DesignSystem/finder.svg?react";
import HelpIcon from "@assets/SVGs/DesignSystem/help.svg?react";
import HomeIcon from "@assets/SVGs/DesignSystem/home.svg?react";
import InboxIcon from "@assets/SVGs/DesignSystem/inbox.svg?react";
import ListadoIcon from "@assets/SVGs/DesignSystem/listado.svg?react";
import LogoutIcon from "@assets/SVGs/DesignSystem/logout.svg?react";
import NotesIcon from "@assets/SVGs/DesignSystem/notes.svg?react";
import PeopleIcon from "@assets/SVGs/DesignSystem/people.svg?react";
import People2Icon from "@assets/SVGs/DesignSystem/people2.svg?react";
import ProfileIcon from "@assets/SVGs/DesignSystem/profile.svg?react";
import QrIcon from "@assets/SVGs/DesignSystem/qr.svg?react";
import SearchIcon from "@assets/SVGs/DesignSystem/search.svg?react";
import SendIcon from "@assets/SVGs/DesignSystem/send.svg?react";
import SettingsIcon from "@assets/SVGs/DesignSystem/settings.svg?react";
import TicketIcon from "@assets/SVGs/DesignSystem/ticket.svg?react";
import WallIcon from "@assets/SVGs/DesignSystem/wall.svg?react";
import BoxIcon from "@assets/SVGs/DesignSystem/box.svg?react";
import WeatherIcon from "@assets/SVGs/DesignSystem/weather.svg?react";
import SunIcon from "@assets/SVGs/DesignSystem/sun.svg?react";
import SunCloudIcon from "@assets/SVGs/DesignSystem/sun-cloud.svg?react";
import LeafIcon from "@assets/SVGs/DesignSystem/leaf.svg?react";
import WaterIcon from "@assets/SVGs/DesignSystem/water.svg?react";
import TemperatureIcon from "@assets/SVGs/DesignSystem/temperature.svg?react";
import WindIcon from "@assets/SVGs/DesignSystem/wind.svg?react";
import ArrowUpIcon from "@assets/SVGs/DesignSystem/arrow-up.svg?react";
import ArrowDownIcon from "@assets/SVGs/DesignSystem/arrow-down.svg?react";
import CycleIcon from "@assets/SVGs/DesignSystem/cycle.svg?react";
import RainCloud from "@assets/SVGs/DesignSystem/raincloud.svg?react";
import CircleCheckIcon from "@assets/SVGs/DesignSystem/circle-check.svg?react";
import LoadingIcon from "@assets/SVGs/DesignSystem/loading.svg?react";
import ExclamationIcon from "@assets/SVGs/DesignSystem/exclamation.svg?react";
import MenuIcon from "@assets/SVGs/DesignSystem/menu.svg?react";
import PlusIcon from "@assets/SVGs/DesignSystem/plus.svg?react";

export interface SystemIconProps {
    color: string
    type:
        | 'bell'
        | 'bank'
        | 'building'
        | 'calendar'
        | 'camera'
        | 'check'
        | 'chart'
        | 'chart2'
        | 'chevron'
        | 'clock'
        | 'dark_mode'
        | 'dashboard'
        | 'delete'
        | 'download'
        | 'edit'
        | 'eye'
        | 'face'
        | 'finder'
        | 'help'
        | 'home'
        | 'inbox'
        | 'listado'
        | 'logout'
        | 'notes'
        | 'people'
        | 'people2'
        | 'profile'
        | 'qr'
        | 'search'
        | 'send'
        | 'settings'
        | 'ticket'
        | 'wall'
        | 'box'
        | 'weather'
        | 'leaf'
        | 'sun'
        | 'water'
        | 'wind'
        | 'temperature'
        | 'sun-cloud'
        | 'arrow-up'
        | 'arrow-down'
        | 'cycle'
        | 'rain-cloud'
        | 'exclamation'
        | 'menu'
        | 'loading'
        | 'circle-check'
        | 'plus'
    className?: string
    size?: "small" | "medium" | "large" | "extra-large" | "extra-extra-large"
    glow?: boolean
    glowColor?: string
}
const DEFAULT_ICON_COLOR = "currentColor";

export const SystemIcon: React.FC<SystemIconProps> = ({
    size = "medium",
    ...props
}) => {

    let resolvedSize: string;
    switch (size) {
        case "small":
            resolvedSize = "12px"
            break;
        case "medium":
            resolvedSize = "24px"
            break;
        case "large":
            resolvedSize = "70px"
            break;
        case "extra-large":
            resolvedSize = "130px"
            break;
        case "extra-extra-large":
            resolvedSize = "160px"
            break;
        default: 
            resolvedSize = "24px"
    }

    const glowColor = props.glowColor ?? props.color ?? DEFAULT_ICON_COLOR;
    const iconStyle: CSSProperties = {
        width: resolvedSize,
        height: resolvedSize,
        color: props.color ?? DEFAULT_ICON_COLOR,
        filter: props.glow
            ? `drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 18px ${glowColor})`
            : undefined
    };
    const iconClassName = ['DSSystemIcon', props.className].filter(Boolean).join(' ');

    switch(props.type) {
        case 'bell':
            return <BellIcon style={iconStyle} className={iconClassName} />;
        case 'bank':
            return <BankIcon style={iconStyle} className={iconClassName} />;
        case 'building':
            return <BuildingIcon style={iconStyle} className={iconClassName} />;
        case 'calendar':
            return <CalendarIcon style={iconStyle} className={iconClassName} />;
        case 'camera':
            return <CameraIcon style={iconStyle} className={iconClassName} />;
        case 'check':
            return <CheckIcon style={iconStyle} className={iconClassName} />;
        case 'chart':
            return <ChartIcon style={iconStyle} className={iconClassName} />;
        case 'chart2':
            return <Chart2Icon style={iconStyle} className={iconClassName} />;
        case 'chevron':
            return <ChevronIcon style={iconStyle} className={iconClassName} />;
        case 'clock':
            return <ClockIcon style={iconStyle} className={iconClassName} />;
        case 'dark_mode':
            return <DarkModeIcon style={iconStyle} className={iconClassName} />;
        case 'dashboard':
            return <DashboardIcon style={iconStyle} className={iconClassName} />;
        case 'edit':
            return <EditIcon style={iconStyle} className={iconClassName} />;
        case 'delete':
            return <DeleteIcon style={iconStyle} className={iconClassName} />;
        case 'download':
            return <DownloadIcon style={iconStyle} className={iconClassName} />;
        case 'eye':
            return <EyeIcon style={iconStyle} className={iconClassName} />;
        case 'face':
            return <FaceIcon style={iconStyle} className={iconClassName} />;
        case 'finder':
            return <FinderIcon style={iconStyle} className={iconClassName} />;
        case 'help':
            return <HelpIcon style={iconStyle} className={iconClassName} />;
        case 'home':
            return <HomeIcon style={iconStyle} className={iconClassName} />;
        case 'inbox':
            return <InboxIcon style={iconStyle} className={iconClassName} />;
        case 'listado':
            return <ListadoIcon style={iconStyle} className={iconClassName} />;
        case 'logout':
            return <LogoutIcon style={iconStyle} className={iconClassName} />;
        case 'notes':
            return <NotesIcon style={iconStyle} className={iconClassName} />;
        case 'people':
            return <PeopleIcon style={iconStyle} className={iconClassName} />;
        case 'people2':
            return <People2Icon style={iconStyle} className={iconClassName} />;
        case 'profile':
            return <ProfileIcon style={iconStyle} className={iconClassName} />;
        case 'qr':
            return <QrIcon style={iconStyle} className={iconClassName} />;
        case 'search':
            return <SearchIcon style={iconStyle} className={iconClassName} />;
        case 'send':
            return <SendIcon style={iconStyle} className={iconClassName} />;
        case 'settings':
            return <SettingsIcon style={iconStyle} className={iconClassName} />;
        case 'ticket':
            return <TicketIcon style={iconStyle} className={iconClassName} />;
        case 'wall':
            return <WallIcon style={iconStyle} className={iconClassName} />;
        case "box":
            return <BoxIcon style={iconStyle} className={iconClassName} />;
        case "weather":
            return <WeatherIcon style={iconStyle} className={iconClassName} />
        case 'leaf':
            return <LeafIcon style={iconStyle} className={iconClassName} />
        case 'sun':
            return <SunIcon style={iconStyle} className={iconClassName} />
        case 'sun-cloud':
            return <SunCloudIcon style={iconStyle} className={iconClassName} />
        case 'water':
            return <WaterIcon style={iconStyle} className={iconClassName} />
        case 'wind':
            return <WindIcon style={iconStyle} className={iconClassName} />
        case 'temperature':
            return <TemperatureIcon style={iconStyle} className={iconClassName} />
        case 'arrow-down':
            return <ArrowDownIcon style={iconStyle} className={iconClassName}/>
        case 'arrow-up':
            return <ArrowUpIcon style={iconStyle} className={iconClassName}/>
        case 'cycle':
            return <CycleIcon style={iconStyle} className={iconClassName}/>
        case 'rain-cloud':
            return <RainCloud style={iconStyle} className={iconClassName}/>
        case 'exclamation':
            return <ExclamationIcon style={iconStyle} className={iconClassName}/>
        case 'menu':
            return <MenuIcon style={iconStyle} className={iconClassName}/>
        case 'loading':
            return <LoadingIcon style={iconStyle} className={iconClassName}/>
        case 'circle-check':
            return <CircleCheckIcon style={iconStyle} className={iconClassName}/>
        case 'plus':
            return <PlusIcon style={iconStyle} className={iconClassName}/> 
    }
}
