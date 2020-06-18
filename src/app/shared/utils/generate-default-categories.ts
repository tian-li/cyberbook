import { Category } from '@spend-book/core/model/category';
import { v4 as uuid } from 'uuid';

export function generateDefaultCategories(userId: string): Category[] {
  return categories.map((category: Partial<Category>) => {
    return {
      userId,
      id: uuid(),
      addedByUser: false,
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
      sortOrder: category.sortOrder,
    };
  });
}

const categories: Partial<Category>[] = [
  {
    name: '超市',
    icon: 'storefront',
    color: '#f76464',
    type: 'spend',
    sortOrder: 0,
  },
  {

    name: '餐饮',
    icon: 'restaurant',
    color: '#5DA5DA',
    type: 'spend',
    sortOrder: 1,
  },
  {

    name: '交通',
    icon: 'commute',
    color: '#FAA43A',
    type: 'spend',
    sortOrder: 2,
  },
  {

    name: '娱乐',
    icon: 'live_tv',
    color: '#60BD68',
    type: 'spend',
    sortOrder: 3,
  },
  {

    name: '住房',
    icon: 'house',
    color: '#F17CB0',
    type: 'spend',
    sortOrder: 4,
  },
  {

    name: '宠物',
    icon: 'pets',
    color: '#B2912F',
    type: 'spend',
    sortOrder: 5,
  },
  {

    name: '学习',
    icon: 'school',
    color: '#B276B2',
    type: 'spend',
    sortOrder: 6,
  },
  {

    name: '其他',
    icon: 'category',
    color: '#DECF3F',
    type: 'spend',
    sortOrder: 7,
  },
  {

    name: '投资',
    icon: 'account_balance_wallet',
    color: '#f76464',
    type: 'income',
    sortOrder: 0,
  },
  {

    name: '工资',
    icon: 'local_atm',
    color: '#5DA5DA',
    type: 'income',
    sortOrder: 1,
  }
];
