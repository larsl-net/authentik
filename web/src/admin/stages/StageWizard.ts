import "@goauthentik/web/admin/stages/authenticator_duo/AuthenticatorDuoStageForm";
import "@goauthentik/web/admin/stages/authenticator_sms/AuthenticatorSMSStageForm";
import "@goauthentik/web/admin/stages/authenticator_static/AuthenticatorStaticStageForm";
import "@goauthentik/web/admin/stages/authenticator_totp/AuthenticatorTOTPStageForm";
import "@goauthentik/web/admin/stages/authenticator_validate/AuthenticatorValidateStageForm";
import "@goauthentik/web/admin/stages/authenticator_webauthn/AuthenticateWebAuthnStageForm";
import "@goauthentik/web/admin/stages/captcha/CaptchaStageForm";
import "@goauthentik/web/admin/stages/consent/ConsentStageForm";
import "@goauthentik/web/admin/stages/deny/DenyStageForm";
import "@goauthentik/web/admin/stages/dummy/DummyStageForm";
import "@goauthentik/web/admin/stages/email/EmailStageForm";
import "@goauthentik/web/admin/stages/identification/IdentificationStageForm";
import "@goauthentik/web/admin/stages/invitation/InvitationStageForm";
import "@goauthentik/web/admin/stages/password/PasswordStageForm";
import "@goauthentik/web/admin/stages/prompt/PromptStageForm";
import "@goauthentik/web/admin/stages/user_delete/UserDeleteStageForm";
import "@goauthentik/web/admin/stages/user_login/UserLoginStageForm";
import "@goauthentik/web/admin/stages/user_logout/UserLogoutStageForm";
import "@goauthentik/web/admin/stages/user_write/UserWriteStageForm";
import { DEFAULT_CONFIG } from "@goauthentik/web/common/api/config";
import { AKElement } from "@goauthentik/web/elements/Base";
import "@goauthentik/web/elements/forms/ProxyForm";
import "@goauthentik/web/elements/wizard/FormWizardPage";
import "@goauthentik/web/elements/wizard/Wizard";
import { WizardPage } from "@goauthentik/web/elements/wizard/WizardPage";

import { t } from "@lingui/macro";

import { customElement } from "@lit/reactive-element/decorators/custom-element.js";
import { CSSResult, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";

import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFForm from "@patternfly/patternfly/components/Form/form.css";
import PFRadio from "@patternfly/patternfly/components/Radio/radio.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

import { StagesApi, TypeCreate } from "@goauthentik/api";

@customElement("ak-stage-wizard-initial")
export class InitialStageWizardPage extends WizardPage {
    @property({ attribute: false })
    stageTypes: TypeCreate[] = [];
    sidebarLabel = () => t`Select type`;

    static get styles(): CSSResult[] {
        return [PFBase, PFForm, PFButton, AKElement.GlobalStyle, PFRadio];
    }

    render(): TemplateResult {
        return html`<form class="pf-c-form pf-m-horizontal">
            ${this.stageTypes.map((type) => {
                return html`<div class="pf-c-radio">
                    <input
                        class="pf-c-radio__input"
                        type="radio"
                        name="type"
                        id=${`${type.component}-${type.modelName}`}
                        @change=${() => {
                            this.host.steps = [
                                "initial",
                                `type-${type.component}-${type.modelName}`,
                            ];
                            this.host.isValid = true;
                        }}
                    />
                    <label class="pf-c-radio__label" for=${`${type.component}-${type.modelName}`}
                        >${type.name}</label
                    >
                    <span class="pf-c-radio__description">${type.description}</span>
                </div>`;
            })}
        </form>`;
    }
}

@customElement("ak-stage-wizard")
export class StageWizard extends AKElement {
    static get styles(): CSSResult[] {
        return [PFBase, PFButton, AKElement.GlobalStyle, PFRadio];
    }

    @property()
    createText = t`Create`;

    @property({ attribute: false })
    stageTypes: TypeCreate[] = [];

    firstUpdated(): void {
        new StagesApi(DEFAULT_CONFIG).stagesAllTypesList().then((types) => {
            this.stageTypes = types;
        });
    }

    render(): TemplateResult {
        return html`
            <ak-wizard
                .steps=${["initial"]}
                header=${t`New stage`}
                description=${t`Create a new stage.`}
            >
                <ak-stage-wizard-initial slot="initial" .stageTypes=${this.stageTypes}>
                </ak-stage-wizard-initial>
                ${this.stageTypes.map((type) => {
                    return html`
                        <ak-wizard-page-form
                            slot=${`type-${type.component}-${type.modelName}`}
                            .sidebarLabel=${() => t`Create ${type.name}`}
                        >
                            <ak-proxy-form type=${type.component}></ak-proxy-form>
                        </ak-wizard-page-form>
                    `;
                })}
                <button slot="trigger" class="pf-c-button pf-m-primary">${this.createText}</button>
            </ak-wizard>
        `;
    }
}
