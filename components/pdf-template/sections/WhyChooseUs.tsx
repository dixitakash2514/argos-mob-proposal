import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';

const strengths = [
  {
    title: 'Industry Expertise',
    desc: 'Years of experience delivering mobile apps, web platforms, and AI-driven solutions across diverse industries.',
  },
  {
    title: 'End-to-End Delivery',
    desc: 'From ideation and design to development, QA, and deployment — we own the full product lifecycle.',
  },
  {
    title: 'Scalable Architecture',
    desc: 'We build with growth in mind. Our systems are designed to scale seamlessly as your user base expands.',
  },
  {
    title: 'Business-Oriented Approach',
    desc: 'We think like product owners, not just developers — every decision is driven by business impact.',
  },
  {
    title: 'Transparent Process',
    desc: 'Regular updates, clear milestones, and open communication at every stage of the project.',
  },
  {
    title: 'Post-Launch Support',
    desc: 'We stay engaged after go-live with dedicated AMC, SLA-backed support, and continuous improvements.',
  },
  {
    title: 'Premium UI/UX Design',
    desc: 'User-first interfaces crafted to drive engagement, retention, and satisfaction.',
  },
  {
    title: 'Client-Centric Culture',
    desc: 'Your success is our success. We align our goals with yours from day one to delivery and beyond.',
  },
];

export function WhyChooseUs() {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Why Choose Argos Mob Tech & AI Pvt. Ltd.
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {strengths.map((s, i) => (
          <View
            key={i}
            style={{
              width: '47%',
              backgroundColor: i % 2 === 0 ? '#F9FAFB' : '#FFF7F4',
              borderLeft: '3px solid #E85D2B',
              padding: '8 10',
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0B1220', marginBottom: 3 }}>
              {s.title}
            </Text>
            <Text style={{ fontSize: 8, color: '#555', lineHeight: 1.5 }}>{s.desc}</Text>
          </View>
        ))}
      </View>

      {/* Our Commitment */}
      <View
        style={{
          backgroundColor: '#0B1220',
          borderRadius: 6,
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#E85D2B', marginBottom: 8 }}>
          Our Commitment
        </Text>
        <Text style={{ fontSize: 9, color: '#CCC', lineHeight: 1.6 }}>
          At ArgosMob Tech & AI Pvt. Ltd., we are committed to transforming your ideas into secure,
          scalable, and high-performing digital platforms. We combine technical excellence with a
          deep understanding of your business goals to deliver solutions that create real value.
          When you partner with us, you gain more than a development team — you gain a long-term
          technology partner dedicated to your growth.
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
}
