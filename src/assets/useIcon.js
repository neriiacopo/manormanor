// src/icons/useIcon.js
import { SvgIcon } from "@mui/material";

import StepsRAW from "@/assets/svg/outlined/icon_steps.svg?raw";
import StairsRAW from "@/assets/svg/outlined/icon_stairs.svg?raw";
import WidthMinRAW from "@/assets/svg/outlined/icon_width_min.svg?raw";
import LightRAW from "@/assets/svg/outlined/icon_light.svg?raw";
import CrashRAW from "@/assets/svg/outlined/icon_crash.svg?raw";
import SlopeRAW from "@/assets/svg/outlined/icon_slope.svg?raw";
import LogoRAW from "@/assets/svg/outlined/icon_logo.svg?raw";
import FaceRaw from "@/assets/svg/outlined/icon_face.svg?raw";

import ProfileBaseRaw from "@/assets/svg/outlined/icon_profiles_base.svg?raw";
import ProfileElderly from "@/assets/svg/outlined/icon_profiles_elderly.svg?raw";
import ProfileParent from "@/assets/svg/outlined/icon_profiles_parent.svg?raw";
import ProfileWheelchair from "@/assets/svg/outlined/icon_profiles_wheelchair.svg?raw";

import StepsSVGR from "@/assets/svg/outlined/icon_steps.svg?react";
import StairsSVGR from "@/assets/svg/outlined/icon_stairs.svg?react";
import WidthMinSVGR from "@/assets/svg/outlined/icon_width_min.svg?react";
import LightSVGR from "@/assets/svg/outlined/icon_light.svg?react";
import CrashSVGR from "@/assets/svg/outlined/icon_crash.svg?react";
import SlopeSVGR from "@/assets/svg/outlined/icon_slope.svg?react";
import CenterlineSVGR from "@/assets/svg/outlined/icon_centerline.svg?react";
import LogoSVGR from "@/assets/svg/outlined/icon_logo.svg?react";
import FaceSVGR from "@/assets/svg/outlined/icon_face.svg?react";

import ProfileBaseSVGR from "@/assets/svg/outlined/icon_profiles_base.svg?react";
import ProfileElderlyIconSVGR from "@/assets/svg/outlined/icon_profiles_elderly.svg?react";
import ProfileParentIconSVGR from "@/assets/svg/outlined/icon_profiles_parent.svg?react";
import ProfileWheelchairIconSVGR from "@/assets/svg/outlined/icon_profiles_wheelchair.svg?react";

export const ICON_MAP = {
    stairs: StairsSVGR,
    steps: StepsSVGR,
    width_min: WidthMinSVGR,
    slope: SlopeSVGR,
    crash: CrashSVGR,
    pali_luce: LightSVGR,
    centerline: CenterlineSVGR,
    logo: LogoSVGR,
    face: FaceSVGR,

    other: ProfileBaseSVGR,
    elderly: ProfileElderlyIconSVGR,
    parent: ProfileParentIconSVGR,
    wheelchair: ProfileWheelchairIconSVGR,
};

export function useIcon(type) {
    return ICON_MAP[type];
}

export function useIconRaw(type) {
    const RAW_MAP = {
        stairs: StairsRAW,
        steps: StepsRAW,
        width_min: WidthMinRAW,
        slope: SlopeRAW,
        crash: CrashRAW,
        pali_luce: LightRAW,
        logo: LogoRAW,
        face: FaceRaw,

        other: ProfileBaseRaw,
        elderly: ProfileElderly,
        parent: ProfileParent,
        wheelchair: ProfileWheelchair,
    };

    return RAW_MAP[type];
}

export function svgToBase64(svgString, fillColor) {
    // ensure color is replaced (optional)
    const colored = svgString.replaceAll("currentColor", fillColor);

    return (
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(colored)))
    );
}
