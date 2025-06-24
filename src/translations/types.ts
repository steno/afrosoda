export type Translation = {
  navigation: {
    language: string;
  };
  menu: {
    about: string;
    privacy: string;
    imprint: string;
  };
  contact: {
    title: string;
    company: string;
    address: string[];
    phone: string;
    fax: string;
    email: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  features: {
    rhythm: {
      title: string;
      description: string;
    };
    energy: {
      title: string;
      description: string;
    };
  };
  products: {
    title: string;
    bottles: {
      [key: string]: {
        name: string;
        description: string;
        features: string[];
      };
    };
  };
  cta: {
    title: string;
    button: string;
  };
  footer: {
    copyright: string;
  };
  about: {
    hero: {
      title: string;
      subtitle: string;
    };
    story: {
      title: string;
      paragraphs: string[];
    };
    values: {
      title: string;
      items: {
        title: string;
        description: string;
      }[];
    };
    testimonials: {
      title: string;
      items: {
        name: string;
        role: string;
        quote: string;
        rating: number;
      }[];
    };
    team: {
      title: string;
      members: {
        name: string;
        role: string;
        description: string;
        image: string;
      }[];
    };
  };
  privacy: {
    hero: {
      title: string;
      subtitle: string;
    };
    sections: {
      introduction: {
        title: string;
        content: string;
      };
      collection: {
        title: string;
        content: string;
        items: string[];
      };
      usage: {
        title: string;
        content: string;
        items: string[];
      };
      cookies: {
        title: string;
        content: string;
      };
      sharing: {
        title: string;
        content: string;
        items: string[];
      };
      rights: {
        title: string;
        content: string;
        items: string[];
      };
      security: {
        title: string;
        content: string;
      };
      children: {
        title: string;
        content: string;
      };
      changes: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        content: string;
        info: {
          company: string;
          address: string[];
          email: string;
          phone: string;
        };
      };
      lastUpdated: string;
    };
  };
  imprint: {
    hero: {
      title: string;
      subtitle: string;
    };
    sections: {
      company: {
        title: string;
        name: string;
        address: string[];
        contact: {
          phone: string;
          fax: string;
          email: string;
          website: string;
        };
      };
      management: {
        title: string;
        content: string;
      };
      register: {
        title: string;
        content: string[];
      };
      authority: {
        title: string;
        content: string;
      };
      responsible: {
        title: string;
        content: string[];
      };
      liability: {
        title: string;
        content: string;
      };
      links: {
        title: string;
        content: string;
      };
      copyright: {
        title: string;
        content: string;
      };
      dispute: {
        title: string;
        content: string;
      };
      lastUpdated: string;
    };
  };
};