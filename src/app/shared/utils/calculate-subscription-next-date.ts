import * as dayjs from 'dayjs';
import { SubscriptionFrequencyTypes } from '../../core/model/subscription';
import { ISOString } from '../model/helper-models';

export function calculateSubscriptionNextDate(
  frequency: SubscriptionFrequencyTypes,
  interval: number,
  startDate: dayjs.Dayjs,
  latestHappenDate: dayjs.Dayjs
): ISOString {
  if (startDate.isSame(latestHappenDate)) {
    return startDate.toISOString();
  }

  switch (frequency) {
    case SubscriptionFrequencyTypes.day:
      return latestHappenDate.add(interval, 'day').toISOString();
    case SubscriptionFrequencyTypes.week:
      return latestHappenDate.add(interval, 'week').toISOString();
    case SubscriptionFrequencyTypes.month:
      return latestHappenDate.add(interval, 'month').toISOString();
    case SubscriptionFrequencyTypes.year:
      return latestHappenDate.add(interval, 'year').toISOString();
    default:
      return startDate.toISOString();
  }
}
