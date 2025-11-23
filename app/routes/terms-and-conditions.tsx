
import TermsAndConditions from '../components/TermsAndConditions';
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import { useTranslation } from "~/i18n/context";

export const meta: MetaFunction = ({location}) => {
  const { t } = useTranslation();

  const meta = generateMeta(
    {
      title: t("terms.meta.title"),
      description: t("terms.meta.description"),
      url: "https://kleinbyte.com/terms-and-conditions",
    }
  );
  return meta;
};

export default function TermsAndConditionsRoute() {
  return <TermsAndConditions />;
}