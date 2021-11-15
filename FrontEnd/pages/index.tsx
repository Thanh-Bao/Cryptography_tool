import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Layout from '@/layout/layout'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MainSymmetric from "@/components/symmetric/MainSymmetric";

const Home: NextPage = () => {
  return (
    <Layout>
      {/* <Tabs style={{ marginLeft: "2%", marginRight: "2%" }}>
        <TabList style={{ fontSize: "1.5em", fontWeight: "bold" }}>
          <Tab>Mã hóa-Encrypt</Tab>
          <Tab>Giải mã-Decrypt</Tab>
        </TabList>

        <TabPanel>
          
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs> */}

      <MainSymmetric />

    </Layout>
  )
}

export default Home
