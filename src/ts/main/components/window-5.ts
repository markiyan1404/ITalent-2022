import * as $ from "jquery";
import { showMenu } from "originTS/navigation/components/menu_icon";

$(".text__button-footer").on("click", (): void => showMenu());
$(".text__button-to-top").on("click", (): JQuery<Element> => $("html").animate({scrollTop: 0}, 700));