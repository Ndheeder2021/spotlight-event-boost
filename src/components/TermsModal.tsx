import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[90vw] max-h-[400px] p-0 rounded-2xl shadow-[0_15px_30px_0_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header */}
        <DialogHeader className="px-8 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <FileText className="w-8 h-8 text-[#750550]" />
              {t('termsHero')}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="flex-1 px-8 py-6">
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="text-base font-bold mb-2">{t('termsAcceptTitle')}</h3>
              <p className="text-muted-foreground">{t('termsAcceptText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsServiceTitle')}</h3>
              <p className="text-muted-foreground">{t('termsServiceText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsAccountTitle')}</h3>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>{t('termsAccountList1')}</li>
                <li>{t('termsAccountList2')}</li>
                <li>{t('termsAccountList3')}</li>
                <li>{t('termsAccountList4')}</li>
                <li>{t('termsAccountList5')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsPaymentTitle')}</h3>
              <p className="text-muted-foreground mb-2">{t('termsPaymentText')}</p>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>{t('termsPaymentList1')}</li>
                <li>{t('termsPaymentList2')}</li>
                <li>{t('termsPaymentList3')}</li>
                <li>{t('termsPaymentList4')}</li>
                <li>{t('termsPaymentList5')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsUsageTitle')}</h3>
              <p className="text-muted-foreground mb-2">{t('termsUsageText')}</p>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>{t('termsUsageList1')}</li>
                <li>{t('termsUsageList2')}</li>
                <li>{t('termsUsageList3')}</li>
                <li>{t('termsUsageList4')}</li>
                <li>{t('termsUsageList5')}</li>
                <li>{t('termsUsageList6')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsIPTitle')}</h3>
              <p className="text-muted-foreground">{t('termsIPText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsTerminationTitle')}</h3>
              <p className="text-muted-foreground">{t('termsTerminationText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsLiabilityTitle')}</h3>
              <p className="text-muted-foreground">{t('termsLiabilityText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsChangesTitle')}</h3>
              <p className="text-muted-foreground">{t('termsChangesText')}</p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('termsContactTitle')}</h3>
              <p className="text-muted-foreground">{t('termsContactText')}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('lastUpdated')} {new Date().toLocaleDateString(t('locale'))}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with gradient fade */}
        <DialogFooter className="px-8 py-5 border-t border-border flex-shrink-0 relative">
          <div className="absolute top-[-50px] left-6 right-6 h-[50px] bg-gradient-to-t from-background/75 to-transparent pointer-events-none" />
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 rounded-lg hover:bg-accent transition-colors font-semibold"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 rounded-lg bg-[#750550] hover:bg-[#4a0433] text-white font-semibold transition-colors"
            >
              {t('accept')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
