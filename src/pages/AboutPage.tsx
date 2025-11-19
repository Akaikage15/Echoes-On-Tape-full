import { useState } from 'react';
import { Send, Instagram, Youtube, User, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const team = [
    { name: 'Александр', role: 'Основатель / A&R', icon: User },
    { name: 'Мария', role: 'Менеджер лейбла', icon: User },
    { name: 'Дмитрий', role: 'Звукорежиссёр', icon: User },
  ];

  const faqs = [
    {
      question: 'Как стать артистом лейбла?',
      answer: 'Отправьте нам демо через форму на странице "Отправить демо". Мы прослушиваем все присланные треки и связываемся с артистами, чья музыка соответствует эстетике лейбла.',
    },
    {
      question: 'Какие жанры вы выпускаете?',
      answer: 'Мы специализируемся на электронной музыке и смежных жанрах: dark ambient, synthwave, dream pop, shoegaze, experimental, lo-fi. Главное — атмосфера и качество продакшена.',
    },
    {
      question: 'Можно ли лицензировать вашу музыку?',
      answer: 'Да, мы открыты к лицензированию для фильмов, игр и других проектов. Свяжитесь с нами через форму обратной связи с деталями вашего проекта.',
    },
    {
      question: 'Как происходит доставка мерча?',
      answer: 'Мы отправляем мерч по всей России через Почту России и СДЭК. Стоимость доставки рассчитывается при оформлении заказа. Обычно доставка занимает 5-14 дней.',
    },
    {
      question: 'Можно ли использовать материалы из PRO-библиотеки коммерчески?',
      answer: 'Да, все материалы из PRO-библиотеки (семплы, пресеты, MIDI) можно использовать в коммерческих проектах. Единственное ограничение — нельзя перепродавать сами файлы.',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto relative z-10"> {/* Added relative z-10 for content over particles */}
          {/* About Section */}
          <section className="mb-16">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-6">
              О лейбле
            </h1>
            <div className="prose prose-invert prose-lg max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Echoes On Tape</strong> — независимый музыкальный лейбл, 
                созданный для тех, кто ищет что-то большее, чем просто музыку. Мы создаем прямую связь 
                между артистами и слушателями, минуя алгоритмы стриминговых платформ.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Наша миссия — поддерживать независимых музыкантов и создавать комьюнити вокруг качественной 
                электронной музыки. Мы выпускаем релизы в жанрах dark ambient, synthwave, dream pop и других 
                атмосферных направлениях.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Через систему подписок мы даем артистам прямой способ монетизации их творчества, а слушателям — 
                доступ к эксклюзивному контенту, ранним релизам и возможность влиять на будущее лейбла.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">Команда</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <div key={index} className="bg-card/80 backdrop-blur-md p-6 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center ring-2 ring-primary">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-['Bebas_Neue'] text-xl mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">Контакты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">Мы в соцсетях</h3>
                <a
                  href="https://t.me/echoesontape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md rounded-lg hover:bg-card/80 transition-colors"
                >
                  <Send className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Telegram</p>
                    <p className="text-sm text-muted-foreground">@echoesontape</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/echoesontape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md rounded-lg hover:bg-card/80 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">@echoesontape</p>
                  </div>
                </a>
                <a
                  href="https://music.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md rounded-lg hover:bg-card/80 transition-colors"
                >
                  <Youtube className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">YouTube Music</p>
                    <p className="text-sm text-muted-foreground">Echoes On Tape</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">info@echoesontape.com</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">Написать нам</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Имя</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Тема</Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="Кратко о чем письмо"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Сообщение</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Ваше сообщение..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="bg-secondary border-border resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Отправить
                  </Button>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">
              Часто задаваемые вопросы
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/80 backdrop-blur-md rounded-lg px-6 border-0"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}

