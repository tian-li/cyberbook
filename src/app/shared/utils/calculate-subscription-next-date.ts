import * as dayjs from 'dayjs';
import { SubscriptionFrequencyTypes } from '../../core/model/subscription';
import { ISOString } from '../model/helper-models';

export function calculateSubscriptionNextDate(
  frequency: SubscriptionFrequencyTypes,
  period: number,
  startDate: dayjs.Dayjs,
  latestHappenDate: dayjs.Dayjs | null
): ISOString {

  if (!latestHappenDate) {
    if (frequency === SubscriptionFrequencyTypes.minute) {
      return dayjs().add(period, 'minute').toISOString();
    }

    return startDate.toISOString();
  }

  switch (frequency) {
    case SubscriptionFrequencyTypes.minute:
      return latestHappenDate.add(period, 'minute').toISOString();
    case SubscriptionFrequencyTypes.day:
      return latestHappenDate.add(period, 'day').toISOString();
    case SubscriptionFrequencyTypes.week:
      return latestHappenDate.add(period, 'week').toISOString();
    case SubscriptionFrequencyTypes.month:
      return latestHappenDate.add(period, 'month').toISOString();
    case SubscriptionFrequencyTypes.year:
      return latestHappenDate.add(period, 'year').toISOString();
    default:
      return startDate.toISOString();
  }
}
