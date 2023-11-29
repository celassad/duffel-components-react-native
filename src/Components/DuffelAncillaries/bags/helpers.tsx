import { SelectedService } from '../../../duffelTypes';

export function withPlural(quantity: number, singular: string, plural: string) {
  return quantity > 1 ? `${quantity} ${plural}` : `${quantity} ${singular}`;
}

export function getBagsAddedText(services: SelectedService[], t: any) {
  if (!services || services?.length === 0) {
    return t('baggageCardSubtitle');
  } else {
    var quantity = 0;
    var amount = 0;
    var currency = services[0]?.service.total_currency;
    services.map((s) => {
      if (s.service.type === 'baggage') {
        quantity += s.quantity;
        amount += Number(s.service.total_amount);
      }
    });

    return `${withPlural(quantity, t('bagAdded'), t('bagsAdded'))} ${t(
      'for'
    )} ${amount} ${currency}`;
  }
}
