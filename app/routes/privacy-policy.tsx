
import PrivacyPolicy from '../components/PrivacyPolicy';
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import { useTranslation } from "~/i18n/context";

export const meta: MetaFunction = () => {
  const { t } = useTranslation();

  const meta = generateMeta(
    {
      title: t("privacy.meta.title"),
      description: t("privacy.meta.description"),
      url: "https://kleinbyte.com/privacy-policy",
    }
  );
  return meta;
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicy />;
}