import { HorizontalContainer } from "@src/design/system/containers"
import logoUrl from "@assets/logo.png"
import { designSystem } from "@src/design/system/designSystem"
import { Subtitle } from "./Texts"


export const Logo: React.FC = () => {
    const size = designSystem.sizes.logo
    return (
        <HorizontalContainer
            height={designSystem.sizes.hundred}
            width={designSystem.sizes.hundred}
            align="center"
            justify="start"
        >
            <span
                style={{    
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundImage: `url(${logoUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: designSystem.shadows.sm,
                }}
            >
            </span>
            <Subtitle
                className="logo-title"
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                ORT
            </Subtitle>
        </HorizontalContainer>
    )
}
