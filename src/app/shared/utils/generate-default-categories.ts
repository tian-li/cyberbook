import { Category } from '@spend-book/core/model/category';
import { v4 as uuid } from 'uuid';

export function generateDefaultCategories(userId: string): Category[] {
  return categories.map((category: Partial<Category>) => {
    return {
      userId,
      id: uuid(),
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
      addedByUser: false,
    };
  });
}

const categories: Partial<Category>[] = [
  {
    name: '超市',
    icon: 'storefront',
    color: '#4D4D4D',
    type: 'spend'
  },
  {

    name: '餐饮',
    icon: 'restaurant',
    color: '#5DA5DA',
    type: 'spend'
  },
  {

    name: '交通',
    icon: 'commute',
    color: '#FAA43A',
    type: 'spend'
  },
  {

    name: '娱乐',
    icon: 'live_tv',
    color: '#60BD68',
    type: 'spend'
  },
  {

    name: '住房',
    icon: 'house',
    color: '#F17CB0',
    type: 'spend'
  },
  {

    name: '宠物',
    icon: 'pets',
    color: '#B2912F',
    type: 'spend'
  },
  {

    name: '学习',
    icon: 'school',
    color: '#B276B2',
    type: 'spend'
  },
  {

    name: '其他',
    icon: 'category',
    color: '#DECF3F',
    type: 'spend'
  },
  {

    name: '投资',
    icon: 'account_balance_wallet',
    color: '#4D4D4D',
    type: 'income'
  },
  {

    name: '工资',
    icon: 'local_atm',
    color: '#5DA5DA',
    type: 'income'
  }
];
